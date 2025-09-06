'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'

export function useClipboard() {
  const [loading, setLoading] = useState(false)

  const copyToClipboard = async (text: string) => {
    setLoading(true)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'absolute'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      toast.success('Copied to clipboard!')
      return true
    } catch (error) {
      toast.error('Failed to copy to clipboard')
      return false
    } finally {
      setLoading(false)
    }
  }

  const readFromClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText()
        return text
      } else {
        toast.error('Clipboard access not supported')
        return null
      }
    } catch (error) {
      toast.error('Failed to read from clipboard')
      return null
    }
  }

  const pasteAndSend = async (sendFunction: (text: string) => Promise<void>) => {
    const text = await readFromClipboard()
    if (text) {
      await sendFunction(text)
    }
  }

  return {
    copyToClipboard,
    readFromClipboard,
    pasteAndSend,
    loading
  }
}