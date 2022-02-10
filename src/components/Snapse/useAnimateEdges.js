import { useEffect, useRef } from 'react'
import cytoscapejs from 'cytoscape'

function useAnimateEdges() {
  const cyRef = useRef(null)
  const setCy = (internal) => {
    cyRef.current = internal
  }

  useEffect(() => {
    const cy = cyRef.current
    let raf
    let animOffset = 0

    function animate() {
      animOffset++
      if (cy) {
        cy.edges().animate({
          style: { 'line-dash-offset': -animOffset }
        })
      }
      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (raf) {
        cancelAnimationFrame(raf)
      }
    }
  }, [])

  return [cyRef, setCy]
}

export default useAnimateEdges
