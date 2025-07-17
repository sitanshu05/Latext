import { useState, useEffect, useCallback, useRef } from 'react'

export interface AutoSaveState {
  isSaving: boolean
  lastSavedAt: string | null
  hasUnsavedChanges: boolean
  saveError: string | null
}

export interface UseAutoSaveOptions {
  content: string
  onSave: (content: string) => Promise<void>
  debounceMs?: number
  enabled?: boolean
}

export const useAutoSave = ({
  content,
  onSave,
  debounceMs = 2000,
  enabled = true
}: UseAutoSaveOptions): AutoSaveState & {
  saveNow: () => Promise<void>
  clearError: () => void
} => {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedContentRef = useRef<string>('')

  // Clear error function
  const clearError = useCallback(() => {
    setSaveError(null)
  }, [])

  // Save function
  const saveNow = useCallback(async () => {
    if (!enabled || content === lastSavedContentRef.current) {
      return
    }

    setIsSaving(true)
    setSaveError(null)

    try {
      await onSave(content)
      lastSavedContentRef.current = content
      setLastSavedAt(new Date().toISOString())
      setHasUnsavedChanges(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Save failed'
      setSaveError(errorMessage)
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [content, onSave, enabled])

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Don't auto-save if content hasn't changed
    if (content === lastSavedContentRef.current) {
      setHasUnsavedChanges(false)
      return
    }

    setHasUnsavedChanges(true)

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveNow()
    }, debounceMs)

    // Cleanup timeout on unmount or content change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, debounceMs, enabled, saveNow])

  // Initialize last saved content
  useEffect(() => {
    if (content && !lastSavedContentRef.current) {
      lastSavedContentRef.current = content
    }
  }, [content])

  return {
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,
    saveError,
    saveNow,
    clearError
  }
} 