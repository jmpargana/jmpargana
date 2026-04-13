/**
 * CINEMATIC REVEAL ANIMATION - MOUSE-DRIVEN SPOTLIGHT
 * 
 * Architecture:
 * - White overlay covers entire page
 * - Mouse movement creates expanding "hole" that reveals content
 * - Perspective distortion increases with distance from origin corner
 * - The further from corner, the more elliptical/skewed the reveal becomes
 * 
 * Technical Choices:
 * 1. SVG over Canvas: Better anti-aliasing, GPU acceleration
 * 2. Radial gradient: Smooth edge falloff
 * 3. Real-time transform: Skew/scale based on cursor distance from corner
 * 
 * Math Approach:
 * - Calculate distance from cursor to origin corner
 * - Apply non-linear distortion based on distance
 * - Further = more elliptical + more skewed
 */

class CinematicReveal {
  constructor(options = {}) {
    // Configuration
    this.config = {
      origin: options.origin || 'top-left',
      baseRadius: options.baseRadius || 200,     // Base reveal radius in pixels
      maxDistortion: options.maxDistortion || 0.8, // Maximum ellipse ratio
      maxSkew: options.maxSkew || 25,             // Maximum skew angle in degrees
      blurAmount: options.blurAmount || 30,       // Edge softness
      smoothing: options.smoothing || 0.15,       // Lerp factor for smooth movement
    };

    // State
    this.currentX = window.innerWidth / 2;
    this.currentY = window.innerHeight / 2;
    this.targetX = this.currentX;
    this.targetY = this.currentY;
    this.animationFrame = null;

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  /**
   * Calculate responsive radius based on viewport size
   * Scales with screen size: larger screens get bigger spotlight
   */
  getResponsiveRadius() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Use viewport diagonal as reference for consistent scaling
    const diagonal = Math.sqrt(vw * vw + vh * vh);
    
    // Scale radius as percentage of diagonal (adjustable multiplier)
    // Base: ~6% of diagonal for mobile, can go up to ~10% for larger screens
    const minRadius = this.config.baseRadius;
    const scaleFactor = 0.08; // 8% of diagonal
    const calculatedRadius = diagonal * scaleFactor;
    
    // Clamp to reasonable bounds
    return Math.max(minRadius, Math.min(calculatedRadius, 500));
  }

  /**
   * Initialize DOM elements and event listeners
   */
  init() {
    console.log('CinematicReveal.init() called');
    console.log('Prefers reduced motion:', this.prefersReducedMotion);
    
    if (this.prefersReducedMotion) {
      // No overlay for reduced motion
      console.log('Reduced motion enabled, skipping overlay');
      return;
    }

    console.log('Creating overlay...');
    this.createOverlay();
    console.log('Overlay created:', this.overlay);
    
    console.log('Binding events...');
    this.bindEvents();
    
    console.log('Starting animation loop...');
    this.startAnimationLoop();
    console.log('Animation loop started');
  }

  /**
   * Create the white overlay element
   */
  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'cinematic-reveal-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');
    
    // Create canvas for custom masking
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    
    this.overlay.appendChild(this.canvas);
    
    // Insert as first child of body to cover everything
    document.body.insertBefore(this.overlay, document.body.firstChild);
    
    // Setup canvas
    this.resizeCanvas();
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Resize canvas to match window (with extra padding for blur)
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth + 40;
    this.canvas.height = window.innerHeight + 40;
  }

  /**
   * Create SVG mask - NOT USED, using Canvas instead
   */
  createSVGMask() {
    // Removed - using canvas approach instead
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Track mouse movement - bind to document to catch all movements
    const handleMouseMove = (e) => {
      this.targetX = e.clientX;
      this.targetY = e.clientY;
      
      // Debug first few mouse events
      if (!this.mouseMoveCount) this.mouseMoveCount = 0;
      this.mouseMoveCount++;
      if (this.mouseMoveCount <= 3) {
        console.log('Mouse move event:', e.clientX, e.clientY);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Also bind to body specifically
    document.body.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    console.log('Mouse event listeners bound to document and body');

    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      // Responsive radius will be recalculated automatically in next animation frame
    });
  }

  /**
   * Calculate origin point based on config
   */
  getOriginPoint() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    const origins = {
      'top-left': { x: 0, y: 0 },
      'top-right': { x: vw, y: 0 },
      'bottom-left': { x: 0, y: vh },
      'bottom-right': { x: vw, y: vh },
    };
    
    return origins[this.config.origin] || origins['top-left'];
  }

  /**
   * Calculate perspective distortion based on distance from origin
   * 
   * Math:
   * - Distance from origin to cursor determines distortion intensity
   * - Further away = more elliptical + more skewed
   * - Direction vector determines skew angle
   */
  calculateDistortion(cursorX, cursorY) {
    const origin = this.getOriginPoint();
    
    // Calculate distance from origin to cursor
    const dx = cursorX - origin.x;
    const dy = cursorY - origin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize distance (0 = at origin, 1 = far corner)
    const maxDistance = Math.sqrt(
      Math.pow(window.innerWidth, 2) + 
      Math.pow(window.innerHeight, 2)
    );
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    // Calculate angle from origin to cursor
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Distortion increases non-linearly with distance
    // Use quadratic easing for more dramatic effect at distance
    const distortionFactor = normalizedDistance * normalizedDistance;
    
    // Aspect ratio distortion (ellipse ratio)
    // Closer to origin = circular (ratio ~1.0)
    // Further away = elliptical (ratio up to maxDistortion)
    const ratio = 1 + (distortionFactor * this.config.maxDistortion);
    
    // Skew angle based on distance and direction
    // The skew should align with the direction from origin
    const skew = distortionFactor * this.config.maxSkew;
    
    return { 
      ratio,      // How much wider the ellipse is (1.0 to 1.8)
      skew,       // Skew angle in degrees (0 to 25)
      rotation: angle, // Rotation to align with direction from origin
      distortionFactor  // For debugging/scaling effects
    };
  }

  /**
   * Linear interpolation for smooth movement
   */
  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  /**
   * Animation loop - updates mask position and distortion
   */
  animate() {
    // Debug mouse tracking
    if (!this.mouseDebugLogged && (this.targetX !== this.currentX || this.targetY !== this.currentY)) {
      console.log('Mouse tracking working! Target:', this.targetX, this.targetY);
      this.mouseDebugLogged = true;
    }
    
    // Smooth cursor following
    this.currentX = this.lerp(this.currentX, this.targetX, this.config.smoothing);
    this.currentY = this.lerp(this.currentY, this.targetY, this.config.smoothing);
    
    // Calculate distortion based on current position
    const distortion = this.calculateDistortion(this.currentX, this.currentY);
    
    // Calculate radii for ellipse using responsive radius
    const responsiveRadius = this.getResponsiveRadius();
    const rx = responsiveRadius * distortion.ratio;
    const ry = responsiveRadius;
    
    if (!this.ctx) {
      console.error('Canvas context not available!');
      return;
    }
    
    if (!this.canvas) {
      console.error('Canvas element not available!');
      return;
    }
    
    // Debug once
    if (!this.hasLogged) {
      console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
      console.log('Initial position:', this.currentX, this.currentY);
      console.log('Ellipse radii:', rx, ry);
      this.hasLogged = true;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Fill with black (changed from white)
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Use composite mode to "cut out" the ellipse
    this.ctx.globalCompositeOperation = 'destination-out';
    
    // Apply blur filter for very diffused edges
    this.ctx.filter = 'blur(15px)';
    
    // Save context state
    this.ctx.save();
    
    // Translate to cursor position (offset by 20px for canvas padding)
    this.ctx.translate(this.currentX + 20, this.currentY + 20);
    
    // Rotate based on direction from origin
    this.ctx.rotate(distortion.rotation * Math.PI / 180);
    
    // Apply skew using transform matrix
    // Matrix: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const skewRadians = distortion.skew * Math.PI / 180;
    this.ctx.transform(1, 0, Math.tan(skewRadians), 1, 0, 0);
    
    // Draw ellipse at origin (already translated)
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    
    // Create radial gradient for soft edges
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');      // Solid center
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.95)'); // Still opaque
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');  // Start fading
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');  // Half transparent
    gradient.addColorStop(0.85, 'rgba(255, 255, 255, 0.2)'); // Very faint
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');      // Fully transparent
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Reset filter
    this.ctx.filter = 'none';
    
    // Restore context state
    this.ctx.restore();
    
    // Reset composite operation
    this.ctx.globalCompositeOperation = 'source-over';
    
    // Continue loop
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Start the animation loop
   */
  startAnimationLoop() {
    this.animate();
  }

  /**
   * Stop the animation
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Remove overlay (to disable effect)
   */
  remove() {
    this.stop();
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

// Check if device is mobile
function isMobileDevice() {
  // Check for touch capability and small screen size
  const hasTouch = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  };
  
  const isSmallScreen = window.innerWidth < 768;
  
  // Only consider it mobile if both touch AND small screen
  // This prevents false positives on desktop browsers in responsive mode
  return hasTouch() && isSmallScreen;
}

// Auto-initialize when DOM is ready
function initCinematicReveal() {
  console.log('Cinematic Reveal: Checking initialization...');
  console.log('Body classes:', document.body.className);
  console.log('Has home-page class:', document.body.classList.contains('home-page'));
  console.log('Is mobile device:', isMobileDevice());
  
  // Skip on mobile devices
  if (isMobileDevice()) {
    console.log('Cinematic Reveal: Mobile device detected, skipping overlay');
    return;
  }
  
  // Only initialize on home page
  if (document.body.classList.contains('home-page')) {
    console.log('Cinematic Reveal: Initializing...');
    window.cinematicReveal = new CinematicReveal({
      origin: 'top-left',      // Corner for perspective origin
      baseRadius: 100,         // Size of reveal circle (smaller reveal)
      maxDistortion: 1.8,      // How elliptical it gets at max distance (bigger distortion)
      maxSkew: 55,             // Maximum skew angle in degrees (bigger perspective skew)
      blurAmount: 30,          // Edge softness
      smoothing: 0.15,         // Cursor following smoothness (smooth lag)
    });
    console.log('Cinematic Reveal: Initialized successfully');
  } else {
    console.log('Cinematic Reveal: Not home page, skipping');
  }
}

// Try multiple initialization strategies
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCinematicReveal);
} else {
  // DOM already loaded
  initCinematicReveal();
}
