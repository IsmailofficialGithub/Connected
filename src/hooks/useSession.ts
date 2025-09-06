'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface UserSession {
  id: string
  session_key: string
  device_info: any
  last_active: string
  expires_at: string
}

export function useSession() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(false)

  // Generate unique session key for current device
  const generateSessionKey = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Create new session for current device
  const createSession = async (deviceInfo = {}) => {
    if (!user) return null

    const sessionKey = generateSessionKey()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24-hour expiry

    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_key: sessionKey,
          device_info: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            ...deviceInfo
          },
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Store session key in localStorage for current device
      localStorage.setItem('session_key', sessionKey)
      return data
    } catch (error) {
      console.error('Error creating session:', error)
      return null
    }
  }

  // Get current device session key
  const getCurrentSessionKey = () => {
    return localStorage.getItem('session_key')
  }

  // Fetch user sessions
  const fetchSessions = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('last_active', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update session activity
  const updateSessionActivity = async () => {
    const sessionKey = getCurrentSessionKey()
    if (!sessionKey || !user) return

    try {
      await supabase
        .from('user_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('session_key', sessionKey)
        .eq('user_id', user.id)
    } catch (error) {
      console.error('Error updating session activity:', error)
    }
  }

  // Delete expired sessions
  const cleanupSessions = async () => {
    if (!user) return

    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id)
        .lt('expires_at', new Date().toISOString())
    } catch (error) {
      console.error('Error cleaning up sessions:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSessions()
      cleanupSessions()

      // Update activity every 5 minutes
      const interval = setInterval(updateSessionActivity, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [user])

  return {
    sessions,
    loading,
    createSession,
    getCurrentSessionKey,
    fetchSessions,
    updateSessionActivity,
    cleanupSessions
  }
}