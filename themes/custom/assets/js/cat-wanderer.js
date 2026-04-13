/**
 * CAT WANDERER - Random movement & laser tracking for cats
 * 
 * Two behaviors:
 * 1. 'track-laser': Smooth lerp-based following of laser cursor with horizontal mirroring
 * 2. 'random-wander': Random straight-line movement with periodic direction changes and edge bouncing
 */

class CatWanderer {
  constructor(catElement, behavior, options = {}) {
    this.cat = catElement
    this.behavior = behavior  // 'track-laser' or 'random-wander'
    
    // Initialize position based on corner or random
    if (options.corner) {
      // Position at specific side/location
      const corners = {
        'left': { x: 0, y: window.innerHeight / 2 },
        'top': { x: window.innerWidth / 2, y: 0 },
        'bottom': { x: window.innerWidth / 2, y: window.innerHeight },
        'right': { x: window.innerWidth, y: window.innerHeight / 2 },
        'top-right': { x: window.innerWidth, y: 0 },
        'bottom-left': { x: 0, y: window.innerHeight },
        'bottom-right': { x: window.innerWidth, y: window.innerHeight },
        'top-left': { x: 0, y: 0 }
      }
      const corner = corners[options.corner] || { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      this.x = corner.x
      this.y = corner.y
      this.corner = options.corner
    } else {
      // Random position on screen
      this.x = Math.random() * window.innerWidth
      this.y = Math.random() * window.innerHeight
    }
    
    // Velocity for random-wander behavior
    this.vx = 0
    this.vy = 0
    
    // Laser tracking parameters
    if (behavior === 'track-laser') {
      this.lerpFactor = options.lerpFactor || 0.1  // 0.05-0.20 for varying speeds
      this.lastScaleX = 1  // Track mirroring state
      
      // Per-cat offset from the laser position (cat body sits at laser + coords)
      // The paw should touch the laser dot, so the body is offset away
      this.coordsOffsetX = (options.coords && options.coords.x) || 0
      this.coordsOffsetY = (options.coords && options.coords.y) || 0
      
      // Paw offset - cats touch laser with paw (at edge), not center
      // Assuming paw is at the right edge when facing right
      this.pawOffsetX = 100  // Half of cat width (200px)
      this.pawOffsetY = 0   // Paw is roughly at center height
    }
    
    // Random wander parameters
    if (behavior === 'random-wander') {
      this.speed = options.speed || 2  // pixels per frame
      this.changeDirectionInterval = options.changeDirectionInterval || 3000  // ms
      this.lastDirectionChange = Date.now()
      
      // Initialize random direction
      this.setRandomDirection()
    }
    
    // Screen bounds (updated on resize)
    this.updateBounds()
    
    // Initial render
    this.render()
  }
  
  /**
   * Update screen bounds (call on window resize)
   */
  updateBounds() {
    this.bounds = {
      left: 0,
      right: window.innerWidth,
      top: 0,
      bottom: window.innerHeight
    }
  }
  
  /**
   * Set random direction for wandering behavior
   */
  setRandomDirection() {
    const angle = Math.random() * Math.PI * 2
    this.vx = Math.cos(angle) * this.speed
    this.vy = Math.sin(angle) * this.speed
  }
  
  /**
   * Linear interpolation helper
   */
  lerp(start, end, factor) {
    return start + (end - start) * factor
  }
  
  /**
   * Update cat position based on behavior
   * @param {number} laserX - Current laser X position
   * @param {number} laserY - Current laser Y position
   * @param {number} deltaTime - Time since last frame (ms)
   * @param {number} now - Current timestamp (ms)
   */
  update(laserX, laserY, deltaTime, now) {
    // Store laser position for mirroring logic
    this.laserX = laserX
    this.laserY = laserY
    
    if (this.behavior === 'track-laser') {
      this.updateLaserTracking(laserX, laserY)
    } else if (this.behavior === 'random-wander') {
      this.updateRandomWander(now)
    }
    
    this.render()
  }
  
  /**
   * Update laser tracking behavior
   */
  updateLaserTracking(laserX, laserY) {
    // Target position: laser + per-cat coordinate offset
    // coords define where the cat body sits relative to the laser
    const targetX = laserX + this.coordsOffsetX
    const targetY = laserY + this.coordsOffsetY
    
    // Calculate paw offset based on which side the laser is on
    const offsetX = (laserX < this.x) ? -this.pawOffsetX : this.pawOffsetX
    
    // Smooth following with lerp, accounting for paw offset
    this.x = this.lerp(this.x, targetX - offsetX, this.lerpFactor)
    this.y = this.lerp(this.y, targetY - this.pawOffsetY, this.lerpFactor)
    
    // Keep within bounds
    this.x = Math.max(this.bounds.left, Math.min(this.bounds.right, this.x))
    this.y = Math.max(this.bounds.top, Math.min(this.bounds.bottom, this.y))
  }
  
  /**
   * Update random wander behavior
   */
  updateRandomWander(now) {
    // Check if it's time to change direction
    if (now - this.lastDirectionChange > this.changeDirectionInterval) {
      this.setRandomDirection()
      this.lastDirectionChange = now
    }
    
    // Update position
    this.x += this.vx
    this.y += this.vy
    
    // Bounce off edges
    if (this.x < this.bounds.left || this.x > this.bounds.right) {
      this.vx = -this.vx  // Reverse horizontal velocity
      this.x = Math.max(this.bounds.left, Math.min(this.bounds.right, this.x))  // Clamp
    }
    
    if (this.y < this.bounds.top || this.y > this.bounds.bottom) {
      this.vy = -this.vy  // Reverse vertical velocity
      this.y = Math.max(this.bounds.top, Math.min(this.bounds.bottom, this.y))  // Clamp
    }
  }
  
  /**
   * Render cat position to DOM
   */
  render() {
    if (!this.cat) return
    
    if (this.behavior === 'track-laser') {
      // Mirror horizontally based on laser direction
      // If laser is to the left of cat, flip cat to face left
      const scaleX = (this.laserX < this.x) ? -1 : 1
      
      // Apply transform with mirroring and centering (offset by half size = 100px for 200px cats)
      this.cat.style.transform = `translate3d(${this.x - 100}px, ${this.y - 100}px, 0) scaleX(${scaleX})`
    } else {
      // Random wanderers don't mirror, just translate (centered)
      this.cat.style.transform = `translate3d(${this.x - 100}px, ${this.y - 100}px, 0)`
    }
  }
}

// Handle window resize for all cat wanderers
let catWandererInstances = []

window.addEventListener('resize', () => {
  catWandererInstances.forEach(cw => cw.updateBounds())
}, { passive: true })

// Export for main.js to register instances
function registerCatWanderer(instance) {
  catWandererInstances.push(instance)
}
