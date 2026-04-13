class CatSpring {
  /**
   * @param {Object} coords  – offset from the laser where this cat sits
   *                            e.g. {x:200, y:0} → 200 px to the RIGHT of the laser
   * @param {Object} opts    – spring physics {stiffness, damping}
   * @param {Element} cat    – the SVG DOM element
   * @param {Element} content – the .home-content container
   */
  constructor(coords, opts, cat, content) {
    this.offsetX = coords.x
    this.offsetY = coords.y

    // Read the element's rendered size so we can centre it properly.
    // Falls back to 200 (the CSS default for .home-cats svg).
    const rect   = cat.getBoundingClientRect()
    this.halfW   = (rect.width  || 200) / 2
    this.halfH   = (rect.height || 200) / 2

    // Some cats are horizontally flipped via CSS class (cat6, cat7).
    // Since we now control `transform` from JS, we bake the flip in here.
    this.flipX = cat.classList.contains('cat6') || cat.classList.contains('cat7')

    // The spring tracks the LASER position.
    // It starts at the centre of the viewport.
    const cx = window.innerWidth  / 2
    const cy = window.innerHeight / 2
    this.vs  = new VanillaSpring({ x: cx, y: cy }, opts)

    this.cat     = cat
    this.content = content

    // Every time the spring ticks, reposition the cat:
    //   screenPos = springValue (≈ laser) + offset
    // Subtract half-width / half-height so the cat's centre sits at that point.
    this.vs.subscribe(pos => {
      const px = pos.x + this.offsetX - this.halfW
      const py = pos.y + this.offsetY - this.halfH
      const flip = this.flipX ? ' scaleX(-1)' : ''
      this.cat.style.transform = `translate3d(${px}px, ${py}px, 0)${flip}`
    })
  }

  /** Set the spring's target to the current laser position. */
  set(c) {
    this.vs.set(c)
  }
}
