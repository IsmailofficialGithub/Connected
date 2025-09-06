
// hooks/useTransfer.ts
'use client'

import { useState } from 'react'
import { Database } from '@/types/supabase'
import { toast } from 'react-hot-toast'

type Transfer = Database['public']['Tables']['transfers']['Row']
type TransferInsert = Database['public']['Tables']['transfers']['Insert']

export function useTransfer() {
  const [loading, setLoading] = useState(false)

  const sendTransfer = async (transfer: Omit<TransferInsert, 'sender_id'>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send transfer')
      }

      const { transfer: newTransfer } = await response.json()
      return newTransfer as Transfer
    } finally {
      setLoading(false)
    }
  }

  const updateTransferStatus = async (transferId: string, status: Transfer['status']) => {
    try {
      const response = await fetch('/api/transfer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transfer_id: transferId, status })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update transfer')
      }

      const { transfer } = await response.json()
      return transfer as Transfer
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const deleteTransfer = async (transferId: string) => {
    try {
      const response = await fetch(`/api/transfer?id=${transferId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete transfer')
      }

      return true
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const fetchTransfers = async (sessionKey?: string, limit = 50) => {
    try {
      const params = new URLSearchParams()
      if (sessionKey) params.append('session_key', sessionKey)
      params.append('limit', limit.toString())

      const response = await fetch(`/api/transfer?${params}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch transfers')
      }

      const { transfers } = await response.json()
      return transfers as Transfer[]
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  return {
    sendTransfer,
    updateTransferStatus,
    deleteTransfer,
    fetchTransfers,
    loading
  }
}