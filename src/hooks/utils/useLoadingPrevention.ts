import { useRef } from 'react'

export function useLoadingPrevention() {
  const loadingRef = useRef(false)

  return {
    canLoad: () => !loadingRef.current,
    setLoading: (loading: boolean) => {
      loadingRef.current = loading
    },
    reset: () => {
      loadingRef.current = false
    }
  }
}
