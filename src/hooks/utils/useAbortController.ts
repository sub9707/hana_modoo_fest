import { useEffect, useCallback, useRef } from 'react'

export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const getController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    return abortControllerRef.current
  }, [])

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return { getController, cleanup }
}
