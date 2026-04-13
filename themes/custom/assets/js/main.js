const root = document.documentElement;
const content = document.querySelector('.home-content');
const laser = document.querySelector('.laser');
const title = document.querySelector('.title-header')
const cats = document.querySelectorAll(".cat")
const themeToggle = document.querySelector('.theme-toggle')
const menuBtn = document.querySelector('.header-menu-btn')
const mobileNav = document.getElementById('mobile-nav')
const mobileNavClose = document.querySelector('.mobile-nav__close')
const mobileNavBackdrop = document.querySelector('.mobile-nav__backdrop')

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'preferred-theme'

function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch (_) {}
  return null
}

function writeStoredTheme(theme) {
  try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch (_) {}
}

function clearStoredTheme() {
  try { localStorage.removeItem(THEME_STORAGE_KEY) } catch (_) {}
}

function getSystemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getEffectiveTheme() {
  const explicit = root.getAttribute('data-theme')
  if (explicit === 'light' || explicit === 'dark') return explicit
  return getSystemPrefersDark() ? 'dark' : 'light'
}

function updateThemeToggleUi() {
  if (!themeToggle) return
  const isDark = getEffectiveTheme() === 'dark'
  themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false')
  themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode')
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
  const icon = themeToggle.querySelector('.theme-toggle-icon')
  if (icon) icon.textContent = isDark ? '☀' : '☾'
}

function applyInitialTheme() {
  const stored = readStoredTheme()
  if (stored) {
    root.setAttribute('data-theme', stored)
  } else {
    root.removeAttribute('data-theme')
    clearStoredTheme()
  }
  updateThemeToggleUi()
}

function initThemeToggle() {
  if (!themeToggle) return
  themeToggle.addEventListener('click', () => {
    const nextTheme = getEffectiveTheme() === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', nextTheme)
    writeStoredTheme(nextTheme)
    updateThemeToggleUi()
  })
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!readStoredTheme()) updateThemeToggleUi()
    })
  }
}

// ─────────────────────────────────────────────────────────────
// MOBILE NAVIGATION DRAWER
// ─────────────────────────────────────────────────────────────
function openMobileNav() {
  if (!mobileNav) return
  mobileNav.classList.add('is-open')
  mobileNav.setAttribute('aria-hidden', 'false')
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'
}

function closeMobileNav() {
  if (!mobileNav) return
  mobileNav.classList.remove('is-open')
  mobileNav.setAttribute('aria-hidden', 'true')
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
}

if (menuBtn) menuBtn.addEventListener('click', openMobileNav)
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav)
if (mobileNavBackdrop) mobileNavBackdrop.addEventListener('click', closeMobileNav)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) closeMobileNav()
})

if (title) {
  title.addEventListener('click', () => { window.location.href = "/" })
}

applyInitialTheme()
initThemeToggle()

// ─────────────────────────────────────────────────────────────
// HOME PAGE — only runs when .home-content exists
// ─────────────────────────────────────────────────────────────
if (!content) return  // bail on non-home pages

// ─────────────────────────────────────────────────────────────
// MOBILE DETECTION — disable animations on mobile devices
// ─────────────────────────────────────────────────────────────
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

// Skip all animations on mobile devices
if (isMobileDevice()) {
  console.log('Mobile device detected, skipping animations');
  return
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp   = (a, b, t) => a + (b - a) * t

// ── Cat spring configs ──────────────────────────────────────
// idle:true → wanders on its own, ignores mouse when cursor is still
const catLocations = [
  { coords: { x:  200, y:    0 }, opts: { stiffness: 0.05, damping: 1.0  }, idle: false },
  { coords: { x:    0, y:  200 }, opts: { stiffness: 0.01, damping: 1.0  }, idle: false },
  { coords: { x:  400, y:  200 }, opts: { stiffness: 0.02, damping: 1.1  }, idle: false },
  { coords: { x: -800, y: -400 }, opts: { stiffness: 0.01, damping: 0.09 }, idle: true  },
  { coords: { x:    0, y: -200 }, opts: { stiffness: 0.08, damping: 0.2  }, idle: false },
  { coords: { x: -500, y: -250 }, opts: { stiffness: 0.2,  damping: 0.8  }, idle: false },
  { coords: { x: -500, y:    0 }, opts: { stiffness: 0.005,damping: 0.2  }, idle: true  },
  { coords: { x:  300, y: -400 }, opts: { stiffness: 0.02, damping: 0.1  }, idle: true  },
  { coords: { x:  300, y:  200 }, opts: { stiffness: 0.01, damping: 1.0  }, idle: false },
  { coords: { x: -200, y:    0 }, opts: { stiffness: 0.2,  damping: 0.2  }, idle: false },
  { coords: { x: -400, y:  200 }, opts: { stiffness: 0.01, damping: 1.0  }, idle: false },
  { coords: { x: -200, y: -500 }, opts: { stiffness: 0.05, damping: 0.3  }, idle: true  },
  { coords: { x:  100, y: -300 }, opts: { stiffness: 0.05, damping: 1.0  }, idle: false },
  { coords: { x: -170, y: -235 }, opts: { stiffness: 0.15, damping: 0.25 }, idle: true  },
]

// ── Laser dot state ─────────────────────────────────────────
const laserCfg = { followLerp: 0.12, minSize: 30, maxSize: 500, jitterMax: 0.8, jitterDamp: 0.06 }
let targetX = window.innerWidth  / 2
let targetY = window.innerHeight / 2
let laserX  = targetX
let laserY  = targetY
let jitterAmp = 0
let laserSize = parseFloat(getComputedStyle(root).getPropertyValue('--dot-size')) || 60

// ── Idle detection ───────────────────────────────────────────
let lastMoveTime = performance.now()
let cursorIsIdle = false
const IDLE_THRESHOLD_MS = 2000

// ── Cat springs ─────────────────────────────────────────────
const catSprings = []
for (let i = 0; i < cats.length; i++) {
  const catCfg = catLocations[i] || catLocations[0]
  const cs = new CatSpring(catCfg.coords, catCfg.opts, cats[i], content)
  cs.isIdle = catCfg.idle
  cs.idlePhase = Math.random() * Math.PI * 2  // random phase offset
  cs.idleSpeed = 0.3 + Math.random() * 0.5    // wander speed
  cs.idleRadius = 80 + Math.random() * 120    // wander radius
  cs.laserSticky = false                       // near-laser sticky state
  cs.stickyUntil = 0
  catSprings.push(cs)
}

// ── Confetti particles ───────────────────────────────────────
const confettiCanvas = document.createElement('canvas')
confettiCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:35;'
if (content) {
  content.appendChild(confettiCanvas)
}
const ctx2d = confettiCanvas.getContext('2d')

function resizeCanvas() {
  confettiCanvas.width  = window.innerWidth
  confettiCanvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener('resize', resizeCanvas, { passive: true })

// ── Wandering cats (home page only) ──────────────────────────
let catWanderers = []
let lastFrameTime = performance.now()

// Only initialize on home page
if (document.body.classList.contains('home-page')) {
  const homeCats = document.querySelectorAll('.home-cats svg')
  
  // Define 3 laser-tracking cats at specific positions with very different speeds
  // coords are pulled from catLocations to offset each cat from the laser
  const cornerCats = [
    { index: 5, corner: 'left', lerpFactor: 0.05, coords: catLocations[5].coords },
    { index: 7, corner: 'top', lerpFactor: 0.15, coords: catLocations[7].coords },
    { index: 9, corner: 'bottom', lerpFactor: 0.25, coords: catLocations[9].coords }
  ]
  
  homeCats.forEach((cat, index) => {
    // Check if this cat should be a corner tracker
    const cornerCat = cornerCats.find(c => c.index === index)
    
    if (cornerCat) {
      // Laser tracking cat positioned at side, with per-cat offset coords
      const wanderer = new CatWanderer(cat, 'track-laser', { 
        lerpFactor: cornerCat.lerpFactor,
        corner: cornerCat.corner,
        coords: cornerCat.coords
      })
      catWanderers.push(wanderer)
      registerCatWanderer(wanderer)
    } else {
      // All others are random wanderers
      const speed = 1 + Math.random() * 2  // 1-3 px/frame
      const changeInterval = 2000 + Math.random() * 3000  // 2-5 seconds
      const wanderer = new CatWanderer(cat, 'random-wander', { 
        speed, 
        changeDirectionInterval: changeInterval 
      })
      catWanderers.push(wanderer)
      registerCatWanderer(wanderer)
    }
  })
  
  console.log(`Initialized ${catWanderers.length} cat wanderers (3 laser trackers at different speeds, ${catWanderers.length - 3} random wanderers)`)
}

const CONFETTI_COLORS = ['#ff00ff', '#00ffff', '#39ff14', '#ff6600', '#ffffff', '#a900a9']
const particles = []

function spawnConfetti(px, py) {
  if (Math.random() > 0.05) return  // throttle - reduced from 0.15 to spawn even more particles
  for (let i = 0; i < 10; i++) {  // increased from 6 to 10 particles per spawn
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 3
    particles.push({
      x: px, y: py,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,  // slight upward bias
      life: 1.0,
      decay: 0.008 + Math.random() * 0.012,  // reduced decay from 0.015-0.035 to 0.008-0.020 for even longer life
      size: 4 + Math.random() * 8,  // increased from 3-9 to 4-12
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      isRect: Math.random() > 0.5,
    })
  }
}

function updateConfetti() {
  ctx2d.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x  += p.vx
    p.y  += p.vy
    p.vy += 0.12   // gravity
    p.vx *= 0.98   // air drag
    p.life -= p.decay
    p.rotation += p.rotSpeed
    if (p.life <= 0) { particles.splice(i, 1); continue }
    ctx2d.save()
    ctx2d.globalAlpha = p.life
    ctx2d.translate(p.x, p.y)
    ctx2d.rotate(p.rotation)
    ctx2d.fillStyle = p.color
    if (p.isRect) {
      ctx2d.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    } else {
      ctx2d.beginPath()
      ctx2d.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx2d.fill()
    }
    ctx2d.restore()
  }
}

// ── Mouse tracking ────────────────────────────────────────────
content.addEventListener('mousemove', (e) => {
  targetX = e.clientX
  targetY = e.clientY
  lastMoveTime = performance.now()
  cursorIsIdle = false

  const laserProximity = 120  // px — radius where cats get sticky
  const coords = { x: e.clientX, y: e.clientY }

  catSprings.forEach(cs => {
    if (cs.isIdle && cursorIsIdle) return  // idle cats ignore mouse when idle

    // Compute cat's approximate screen position
    const catEl = cs.cat
    const catRect = catEl.getBoundingClientRect()
    const catCx = catRect.left + catRect.width  / 2
    const catCy = catRect.top  + catRect.height / 2
    const dist = Math.hypot(e.clientX - catCx, e.clientY - catCy)

    if (dist < laserProximity) {
      // Cat is near the laser — make it sluggish (sticky feel)
      if (!cs.laserSticky) {
        cs.laserSticky = true
        cs.stickyUntil = performance.now() + 600 + Math.random() * 400
        // Temporarily dampen the spring
        cs.vs.stiffness = cs.vs.stiffness * 0.3
        cs.vs.damping   = cs.vs.damping   * 3
      }
    }

    cs.set(coords)
  })
}, { passive: true })

content.addEventListener('wheel', (e) => {
  laserSize = clamp(laserSize + (-e.deltaY * 0.1), laserCfg.minSize, laserCfg.maxSize)
  root.style.setProperty('--dot-size', laserSize + 'px')
}, { passive: true })

// ── Idle wander ──────────────────────────────────────────────
let idleTick = 0

function wanderIdleCats(now) {
  const sinceMove = now - lastMoveTime
  if (sinceMove < IDLE_THRESHOLD_MS) return

  if (!cursorIsIdle) {
    cursorIsIdle = true
  }

  idleTick += 0.008

  catSprings.forEach((cs, i) => {
    if (!cs.isIdle) return
    const phase = cs.idlePhase + idleTick * cs.idleSpeed
    const wx = window.innerWidth  / 2 + Math.cos(phase * 1.3) * cs.idleRadius * 1.5
    const wy = window.innerHeight / 2 + Math.sin(phase * 0.7) * cs.idleRadius
    cs.set({ x: wx, y: wy })
  })
}

// ── Restore sticky cats ──────────────────────────────────────
// Restore sticky cats — reset spring to original stiffness/damping
function restoreStickySpring(cs, origOpts) {
  if (cs.laserSticky && performance.now() > cs.stickyUntil) {
    cs.laserSticky = false
    cs.vs.stiffness = origOpts.stiffness
    cs.vs.damping   = origOpts.damping
  }
}

const origOpts = catSprings.map(cs => ({ stiffness: cs.vs.stiffness, damping: cs.vs.damping }))

// ── Laser hue rotation ───────────────────────────────────────
let laserHue = 0

// ── Animation loop ───────────────────────────────────────────
function raf(now) {
  // Laser dot smooth follow
  laserX = lerp(laserX, targetX, laserCfg.followLerp)
  laserY = lerp(laserY, targetY, laserCfg.followLerp)

  const dist = Math.hypot(targetX - laserX, targetY - laserY)
  if (dist < 2) {
    if (jitterAmp < 0.5) jitterAmp = laserCfg.jitterMax
  }
  if (jitterAmp > 0.05) {
    laserX += (Math.random() - 0.5) * jitterAmp
    laserY += (Math.random() - 0.5) * jitterAmp
    jitterAmp *= laserCfg.jitterDamp
  }

  if (laser) {
    laser.style.transform = `translate(${laserX - laserSize/2}px, ${laserY - laserSize/2}px)`
  }

  // Hue cycle on laser dot
  laserHue = (laserHue + 1.2) % 360
  root.style.setProperty('--laser-hue', laserHue)

  // Confetti from laser position
  spawnConfetti(laserX + laserSize/2, laserY + laserSize/2)
  updateConfetti()

  // Update wandering cats (home page only)
  if (catWanderers.length > 0) {
    const deltaTime = now - lastFrameTime
    catWanderers.forEach(cw => cw.update(laserX, laserY, deltaTime, now))
    lastFrameTime = now
  }

  // Idle cat wander
  wanderIdleCats(now)

  // Restore any sticky springs
  catSprings.forEach((cs, i) => restoreStickySpring(cs, origOpts[i]))

  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
