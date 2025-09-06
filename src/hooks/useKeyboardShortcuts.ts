'use client'

import { useEffect } from 'react'

interface KeyboardShortcuts {
  onCtrlEnter?: () => void
  onCtrlV?: () => void
  onEscape?: () => void
  onCtrlL?: () => void
}

export function useKeyboardShortcuts({
  onCtrlEnter,
  onCtrlV,
  onEscape,
  onCtrlL
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      if (isCtrlOrCmd && event.key === 'Enter' && onCtrlEnter) {
        event.preventDefault()
        onCtrlEnter()
      }

      if (isCtrlOrCmd && event.key === 'v' && onCtrlV) {
        // Let default paste behavior happen, then trigger our handler
        setTimeout(onCtrlV, 0)
      }

      if (event.key === 'Escape' && onEscape) {
        event.preventDefault()
        onEscape()
      }

      if (isCtrlOrCmd && event.key === 'l' && onCtrlL) {
        event.preventDefault()
        onCtrlL()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onCtrlEnter, onCtrlV, onEscape, onCtrlL])
}