import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

let counter = 0

// Global cache so data survives component unmount/remount during tab switches
const globalCache = new Map<string, { data: any[]; timestamp: number }>()

export function useRealtime<T extends { id: string }>(
  table: string,
  fetchFn: () => Promise<T[]>,
  deps: unknown[] = []
) {
  const cached = globalCache.get(table)
  const [data, setData] = useState<T[]>(cached?.data || [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState<Error | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const unmounted = useRef(false)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      const items = await fetchFn()
      globalCache.set(table, { data: items, timestamp: Date.now() })
      if (!unmounted.current) {
        setData(items)
        setError(null)
      }
    } catch (e) {
      if (!unmounted.current) {
        setError(e as Error)
      }
    } finally {
      if (!unmounted.current) {
        setLoading(false)
      }
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    unmounted.current = false
    const name = `${table}-${++counter}-${Date.now()}`

    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Fetch initial data
    refresh()

    // Subscribe to changes
    const channel = supabase
      .channel(name)
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table },
        (payload: RealtimePostgresChangesPayload<T>) => {
          setData(prev => {
            let next: T[]
            if (payload.eventType === 'INSERT') {
              if (prev.some(item => item.id === payload.new.id)) return prev
              next = [...prev, payload.new as T]
            } else if (payload.eventType === 'UPDATE') {
              next = prev.map(item => (item.id === payload.new.id ? (payload.new as T) : item))
            } else if (payload.eventType === 'DELETE') {
              next = prev.filter(item => item.id !== payload.old.id)
            } else {
              return prev
            }
            globalCache.set(table, { data: next, timestamp: Date.now() })
            return next
          })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      unmounted.current = true
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [table, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  const mutate = useCallback((updater: (prev: T[]) => T[]) => {
    setData(updater)
  }, [])

  return { data, loading, error, refresh, mutate }
}
