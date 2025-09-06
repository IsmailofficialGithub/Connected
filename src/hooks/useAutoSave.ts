'use client'

import { useEffect, useRef } from 'react'

export function useAutoSave(
  value: string,
  onSave: (value: string) => void,
  delay = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (value.trim()) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        onSave(value)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, onSave, delay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}