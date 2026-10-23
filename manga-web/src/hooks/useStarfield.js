import { useEffect, useRef } from 'react'

const STAR_DENSITY = 4200
const MAX_DPR = 2
const RESIZE_DEBOUNCE_MS = 120

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function createStar(width, height) {
  const isBig = Math.random() < 0.06
  const isDim = !isBig && Math.random() < 0.3
  const radius = isBig ? randomBetween(1.5, 2.4) : randomBetween(0.35, 1.15)

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius,
    alpha: isBig ? 0.9 : randomBetween(0.25, 0.85),
    brightness: isDim ? 0.7 : 1,
    isBig,
    speed: randomBetween(0.4, 2),
    phase: Math.random() * Math.PI * 2,
    speedFactor: randomBetween(0.5, 1.5),
  }
}

function createShootingStar(width, height) {
  const angle = randomBetween(0.84, 0.92) * Math.PI

  return {
    x: randomBetween(0.25, 0.95) * width,
    y: randomBetween(0.02, 0.42) * height,
    dirX: Math.cos(angle),
    dirY: Math.sin(angle),
    speed: randomBetween(0.55, 0.95),
    length: randomBetween(90, 180),
    life: 0,
    maxLife: randomBetween(0.9, 1.4),
  }
}

export function useStarfield(canvasRef) {
  const frameRef = useRef(null)
  const starsRef = useRef([])
  const shootersRef = useRef([])
  const nextShooterRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let lastTime = 0
    let startTime = 0
    let resizeTimer = null

    const rebuildStars = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round((width * height) / STAR_DENSITY)
      starsRef.current = Array.from({ length: count }, () => createStar(width, height))
    }

    const drawStars = (time, animate) => {
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, width, height)

      for (const star of starsRef.current) {
        const twinkle = animate
          ? 0.65 + 0.35 * Math.sin(time * 0.001 * star.speed + star.phase)
          : 1
        const alpha = star.alpha * twinkle
        const gray = Math.round(255 * star.brightness)

        if (star.isBig) {
          const haloRadius = star.radius * 5
          const haloGradient = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            haloRadius
          )
          haloGradient.addColorStop(0, `rgba(255, 255, 255, ${0.35 * twinkle})`)
          haloGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = haloGradient
          ctx.beginPath()
          ctx.arc(star.x, star.y, haloRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawShooters = () => {
      for (const shooter of shootersRef.current) {
        const fade = Math.sin((shooter.life / shooter.maxLife) * Math.PI)
        const tailX = shooter.x - shooter.dirX * shooter.length
        const tailY = shooter.y - shooter.dirY * shooter.length

        const gradient = ctx.createLinearGradient(shooter.x, shooter.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${fade})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.6
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(shooter.x, shooter.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`
        ctx.beginPath()
        ctx.arc(shooter.x, shooter.y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const frame = (time) => {
      if (!startTime) startTime = time
      const dt = lastTime ? Math.min(time - lastTime, 50) : 16
      lastTime = time
      const elapsed = time - startTime

      for (const star of starsRef.current) {
        star.x -= dt * 0.002 * star.speedFactor
        if (star.x < -2) star.x += width + 4
      }

      if (elapsed >= nextShooterRef.current) {
        shootersRef.current.push(createShootingStar(width, height))
        nextShooterRef.current = elapsed + randomBetween(3500, 8500)
      }

      for (let i = shootersRef.current.length - 1; i >= 0; i -= 1) {
        const shooter = shootersRef.current[i]
        shooter.life += dt / 1000
        shooter.x += shooter.dirX * shooter.speed * dt
        shooter.y += shooter.dirY * shooter.speed * dt
        if (shooter.life >= shooter.maxLife) shootersRef.current.splice(i, 1)
      }

      drawStars(time, true)
      drawShooters()

      frameRef.current = requestAnimationFrame(frame)
    }

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resizeTimer = null
        rebuildStars()
        if (reducedMotion) drawStars(0, false)
      }, RESIZE_DEBOUNCE_MS)
    }

    rebuildStars()

    if (reducedMotion) {
      drawStars(0, false)
    } else {
      nextShooterRef.current = 1200
      frameRef.current = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) clearTimeout(resizeTimer)
    }
  }, [canvasRef])
}
