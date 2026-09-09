import { useEffect, useRef } from 'react'

/**
 * Returns a ref to attach to the scroll container; scrolls it to the bottom
 * whenever `deps` changes (e.g. the message list).
 */
export function useAutoScroll(deps) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return containerRef
}
