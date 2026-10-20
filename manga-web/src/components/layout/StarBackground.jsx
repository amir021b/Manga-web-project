import { useRef } from 'react'
import { useStarfield } from '../../hooks/useStarfield'
import styles from './StarBackground.module.css'

function StarBackground() {
  const canvasRef = useRef(null)

  useStarfield(canvasRef)

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}

export default StarBackground
