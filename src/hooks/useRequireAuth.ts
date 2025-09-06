'use client'

import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'

export function useRequireAuth(redirectTo = '/auth/login') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}
