import { useEffect, useState } from "react"

export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

/**
 * Minimal async-data hook for read-only Supabase fetches. Re-runs when `deps`
 * change and ignores stale results after unmount / dep change. Intentionally
 * tiny — no caching; the site's reads are small and infrequent.
 */
export function useAsyncData<T>(
  fn: () => Promise<T>,
  deps: unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  })

  useEffect(() => {
    let active = true
    setState({ data: undefined, loading: true, error: undefined })
    fn()
      .then((data) => {
        if (active) setState({ data, loading: false, error: undefined })
      })
      .catch((err) => {
        if (active)
          setState({
            data: undefined,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
