class VanillaSpring {
  constructor(initialValue, options = {}) {
    this.stiffness = options.stiffness ?? 0.15;
    this.damping = options.damping ?? 0.8;
    this.precision = options.precision ?? 0.01;
    
    this.current = initialValue;
    this.target = initialValue;
    this.lastValue = initialValue;
    this.lastTime = performance.now();
    
    this.inverseMass = 1;
    this.momentum = 0;
    this.task = null;
    this.subscribers = new Set();
    this.deferred = null;
  }

  // Subscribe to value changes
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.current); // Call immediately with current value
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers of value change
  notify() {
    this.subscribers.forEach(callback => callback(this.current));
  }

  // Check if value is a Date object
  isDate(value) {
    return value instanceof Date;
  }

  // Core spring physics calculation
  tickSpring(ctx, lastValue, currentValue, targetValue) {
    if (typeof currentValue === 'number' || this.isDate(currentValue)) {
      const delta = targetValue - currentValue;
      const velocity = (currentValue - lastValue) / (ctx.dt || 1 / 60);
      const spring = ctx.opts.stiffness * delta;
      const damper = ctx.opts.damping * velocity;
      const acceleration = (spring - damper) * ctx.invMass;
      const d = (velocity + acceleration) * ctx.dt;
      
      if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
        return targetValue; // settled
      } else {
        ctx.settled = false;
        return this.isDate(currentValue) 
          ? new Date(currentValue.getTime() + d) 
          : currentValue + d;
      }
    } else if (Array.isArray(currentValue)) {
      return currentValue.map((_, i) =>
        this.tickSpring(ctx, lastValue[i], currentValue[i], targetValue[i])
      );
    } else if (typeof currentValue === 'object' && currentValue !== null) {
      const nextValue = {};
      for (const k in currentValue) {
        nextValue[k] = this.tickSpring(ctx, lastValue[k], currentValue[k], targetValue[k]);
      }
      return nextValue;
    } else {
      throw new Error(`Cannot spring ${typeof currentValue} values`);
    }
  }

  // Animation loop using requestAnimationFrame
  loop(callback) {
    let running = true;
    let promise;
    let resolve;
    
    promise = new Promise(r => resolve = r);
    
    const tick = (now) => {
      if (!running) return;
      
      const shouldContinue = callback(now);
      if (shouldContinue) {
        requestAnimationFrame(tick);
      } else {
        running = false;
        resolve();
      }
    };
    
    requestAnimationFrame(tick);
    
    return {
      promise,
      abort: () => {
        running = false;
        resolve();
      }
    };
  }

  // Set new target value with optional animation options
  set(newValue, options = {}) {
    this.target = newValue;
    
    // Cancel previous deferred promise
    if (this.deferred) {
      this.deferred.reject(new Error('Aborted'));
      this.deferred = null;
    }
    
    // Instant update
    if (options.instant || this.current == null || 
        (this.stiffness >= 1 && this.damping >= 1)) {
      if (this.task) {
        this.task.abort();
        this.task = null;
      }
      this.lastTime = performance.now();
      this.lastValue = newValue;
      this.current = newValue;
      this.notify();
      return Promise.resolve();
    }
    
    // Preserve momentum option
    if (options.preserveMomentum) {
      this.inverseMass = 0;
      this.momentum = options.preserveMomentum;
    }
    
    // Start animation if not already running
    if (!this.task) {
      this.lastTime = performance.now();
      const invMassRecoveryRate = this.momentum ? 1000 / (this.momentum * 60) : 0;
      
      this.task = this.loop((now) => {
        this.inverseMass = Math.min(this.inverseMass + invMassRecoveryRate, 1);
        
        // Clamp elapsed time to prevent spring from going haywire
        const elapsed = Math.min(now - this.lastTime, 1000 / 30);
        
        const ctx = {
          invMass: this.inverseMass,
          opts: {
            stiffness: this.stiffness,
            damping: this.damping,
            precision: this.precision
          },
          settled: true,
          dt: (elapsed * 60) / 1000
        };
        
        const nextValue = this.tickSpring(ctx, this.lastValue, this.current, this.target);
        this.lastTime = now;
        this.lastValue = this.current;
        this.current = nextValue;
        this.notify();
        
        if (ctx.settled) {
          this.task = null;
        }
        
        return !ctx.settled;
      });
    }
    
    // Create and return promise
    this.deferred = {
      promise: null,
      resolve: null,
      reject: null
    };
    
    this.deferred.promise = new Promise((resolve, reject) => {
      this.deferred.resolve = resolve;
      this.deferred.reject = reject;
    });
    
    this.task.promise.then(() => {
      if (this.deferred) {
        this.deferred.resolve();
        this.deferred = null;
      }
    });
    
    return this.deferred.promise;
  }

  // Update using a function (similar to Svelte's update method)
  update(fn, options) {
    return this.set(fn(this.target, this.current), options);
  }
}