// lib/realtime.ts
'use client'

import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type Transfer = Database['public']['Tables']['transfers']['Row']
type TransferInsert = Database['public']['Tables']['transfers']['Insert']

export class RealtimeManager {
  private channel: RealtimeChannel | null = null
  private userId: string | null = null
  private sessionKey: string | null = null

  constructor(userId: string, sessionKey?: string) {
    this.userId = userId
    this.sessionKey = sessionKey || null
  }

  // Subscribe to transfers for the current user
  subscribeToTransfers(callbacks: {
    onInsert?: (transfer: Transfer) => void
    onUpdate?: (transfer: Transfer) => void
    onDelete?: (transfer: Transfer) => void
  }) {
    if (this.channel) {
      this.unsubscribe()
    }

    // Create channel name based on user ID
    const channelName = `transfers:${this.userId}`
    
    this.channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transfers',
          filter: `receiver_id=eq.${this.userId}`
        },
        (payload) => {
          callbacks.onInsert?.(payload.new as Transfer)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transfers',
          filter: `receiver_id=eq.${this.userId}`
        },
        (payload) => {
          callbacks.onUpdate?.(payload.new as Transfer)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'transfers',
          filter: `receiver_id=eq.${this.userId}`
        },
        (payload) => {
          callbacks.onDelete?.(payload.old as Transfer)
        }
      )
      .subscribe()

    return this.channel
  }

  // Subscribe to session-based transfers (for QR code sharing)
  subscribeToSessionTransfers(sessionKey: string, callbacks: {
    onInsert?: (transfer: Transfer) => void
    onUpdate?: (transfer: Transfer) => void
  }) {
    if (this.channel) {
      this.unsubscribe()
    }

    const channelName = `session:${sessionKey}`
    
    this.channel = supabase.channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transfers',
          filter: `session_key=eq.${sessionKey}`
        },
        (payload) => {
          callbacks.onInsert?.(payload.new as Transfer)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'transfers',
          filter: `session_key=eq.${sessionKey}`
        },
        (payload) => {
          callbacks.onUpdate?.(payload.new as Transfer)
        }
      )
      .subscribe()

    return this.channel
  }

  // Send a transfer
  async sendTransfer(transfer: Omit<TransferInsert, 'sender_id'>) {
    if (!this.userId) throw new Error('User ID is required')

    const transferData: TransferInsert = {
      ...transfer,
      sender_id: this.userId,
      session_key: this.sessionKey
    }


    console.log(transferData)

    const { data, error } = await supabase
      .from('transfers')
      .insert(transferData)
      .select()
      .single()
      console.log(error)
    if (error) throw error
    return data
  }

  // Update transfer status
  async updateTransferStatus(transferId: string, status: Transfer['status']) {
    const { data, error } = await supabase
      .from('transfers')
      .update({ status })
      .eq('id', transferId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get transfers for user
  async getTransfers(limit = 50) {
    if (!this.userId) throw new Error('User ID is required')

    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .or(`sender_id.eq.${this.userId},receiver_id.eq.${this.userId}`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Get transfers by session key
  async getSessionTransfers(sessionKey: string, limit = 20) {
    const { data, error } = await supabase
      .from('transfers')
      .select('*')
      .eq('session_key', sessionKey)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  // Unsubscribe from current channel
  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  // Send presence (show online status)
  sendPresence(data: Record<string, any> = {}) {
    if (!this.channel) return

    this.channel.track({
      user_id: this.userId,
      online_at: new Date().toISOString(),
      ...data
    })
  }

  // Listen to presence changes
  onPresenceSync(callback: (presences: Record<string, any[]>) => void) {
    if (!this.channel) return

    this.channel.on('presence', { event: 'sync' }, () => {
      const presences = this.channel?.presenceState()
      callback(presences || {})
    })
  }
}

// Hook to use realtime manager
import { useState, useEffect, useRef } from 'react'
import { useAuth } from './auth'

export function useRealtime(sessionKey?: string) {
  const { user } = useAuth()
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any[]>>({})
  const realtimeRef = useRef<RealtimeManager | null>(null)

  useEffect(() => {
    if (!user) return

    // Initialize realtime manager
    realtimeRef.current = new RealtimeManager(user.id, sessionKey)

    // Load initial transfers
    const loadTransfers = async () => {
      try {
        const data = sessionKey 
          ? await realtimeRef.current!.getSessionTransfers(sessionKey)
          : await realtimeRef.current!.getTransfers()
        setTransfers(data || [])
      } catch (error) {
        console.error('Error loading transfers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTransfers()

    // Subscribe to realtime updates
    const subscriptionCallbacks = {
      onInsert: (transfer: Transfer) => {
        setTransfers(prev => [transfer, ...prev])
      },
      onUpdate: (transfer: Transfer) => {
        setTransfers(prev => 
          prev.map(t => t.id === transfer.id ? transfer : t)
        )
      },
      onDelete: (transfer: Transfer) => {
        setTransfers(prev => prev.filter(t => t.id !== transfer.id))
      }
    }

    if (sessionKey) {
      realtimeRef.current.subscribeToSessionTransfers(sessionKey, subscriptionCallbacks)
    } else {
      realtimeRef.current.subscribeToTransfers(subscriptionCallbacks)
    }

    // Setup presence tracking
    realtimeRef.current.sendPresence()
    realtimeRef.current.onPresenceSync(setOnlineUsers)

    return () => {
      realtimeRef.current?.unsubscribe()
    }
  }, [user, sessionKey])

  const sendTransfer = async (transfer: Omit<TransferInsert, 'sender_id'>) => {
    if (!realtimeRef.current) throw new Error('Realtime manager not initialized')
    return realtimeRef.current.sendTransfer(transfer)
  }

  const updateStatus = async (transferId: string, status: Transfer['status']) => {
    if (!realtimeRef.current) throw new Error('Realtime manager not initialized')
    return realtimeRef.current.updateTransferStatus(transferId, status)
  }

  return {
    transfers,
    loading,
    onlineUsers,
    sendTransfer,
    updateStatus,
    realtimeManager: realtimeRef.current
  }
}