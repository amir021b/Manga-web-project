import { useRef } from 'react'
import { useStarfield } from '../../hooks/useStarfield'

function StarBackground() {
  const canvasRef = useRef(null)

  useStarfield(canvasRef)

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 block h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default StarBackground
