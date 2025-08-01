'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { EditorComponent } from './EditorComponent'
import { FileIcon, SaveIcon, MaximizeIcon, MinimizeIcon, ClockIcon, FolderIcon, AlertCircleIcon } from 'lucide-react'
import { useAutoSave } from '@/lib/hooks/useAutoSave'

// File metadata interface
export interface FileMetadata {
  id: string
  name: string
  file_type: string
  size: number
  created_at: string | null
  updated_at: string | null
  content: string
}

// FileEditor props
export interface FileEditorProps {
  file: FileMetadata | null
  onSave: (content: string) => Promise<void>
  onContentChange?: (content: string) => void
  loading?: boolean
  error?: string | null
  className?: string
}

// Status bar component
const StatusBar: React.FC<{
  fileName: string
  fileType: string
  lineCount: number
  charCount: number
  wordCount: number
  cursorLine: number
  cursorCol: number
  savedAt?: string | null
  isSaving?: boolean
  hasUnsavedChanges?: boolean
  saveError?: string | null
  isFullScreen: boolean
  onToggleFullScreen: () => void
}> = ({
  fileName,
  fileType,
  lineCount,
  charCount,
  wordCount,
  cursorLine,
  cursorCol,
  savedAt,
  isSaving = false,
  hasUnsavedChanges = false,
  saveError = null,
  isFullScreen,
  onToggleFullScreen
}) => (
  <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t text-sm">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <FileIcon className="w-4 h-4" />
        <span className="font-medium">{fileName}</span>
        <span className="text-gray-500">({fileType})</span>
      </div>
      
      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
        <span>Lines: {lineCount}</span>
        <span>Characters: {charCount}</span>
        <span>Words: {wordCount}</span>
      </div>
    </div>
    
    <div className="flex items-center space-x-4">
      <div className="text-gray-600 dark:text-gray-400">
        Ln {cursorLine}, Col {cursorCol}
      </div>
      
      {/* Save status indicators */}
      {isSaving && (
        <div className="flex items-center space-x-1 text-blue-600">
          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Saving...</span>
        </div>
      )}
      
      {hasUnsavedChanges && !isSaving && (
        <div className="flex items-center space-x-1 text-orange-600">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          <span>Unsaved</span>
        </div>
      )}
      
      {saveError && (
        <div className="flex items-center space-x-1 text-red-600" title={saveError}>
          <AlertCircleIcon className="w-3 h-3" />
          <span>Save Error</span>
        </div>
      )}
      
      {savedAt && !isSaving && !hasUnsavedChanges && !saveError && (
        <div className="flex items-center space-x-1 text-green-600">
          <ClockIcon className="w-3 h-3" />
          <span>Saved: {new Date(savedAt).toLocaleTimeString()}</span>
        </div>
      )}
      
      <button
        onClick={onToggleFullScreen}
        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullScreen ? (
          <MinimizeIcon className="w-4 h-4" />
        ) : (
          <MaximizeIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
)



// File not found component
const FileNotFound: React.FC<{ fileName: string }> = ({ fileName }) => (
  <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
    <div className="text-center space-y-4">
      <FolderIcon className="w-16 h-16 text-gray-400 mx-auto" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">File Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The file <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{fileName}</code> could not be loaded.
        </p>
      </div>
      <div className="text-sm text-gray-500">
        Please check if the file exists or contact support if this error persists.
      </div>
    </div>
  </div>
)

// Main FileEditor component
export const FileEditor: React.FC<FileEditorProps> = ({
  file,
  onSave,
  onContentChange,
  loading = false,
  error = null,
  className = ''
}) => {
  const [content, setContent] = useState<string>('')
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [cursorPosition] = useState({ line: 1, col: 1 })

  // Auto-save hook
  const {
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,
    saveError,
    saveNow
  } = useAutoSave({
    content,
    onSave,
    debounceMs: 900,
    enabled: !!file
  })

  // Initialize content when file changes
  useEffect(() => {
    if (file) {
      setContent(file.content)
    } else {
      setContent('')
    }
  }, [file])

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    onContentChange?.(newContent)
  }, [onContentChange])

  // Handle manual save
  const handleSave = useCallback(async () => {
    await saveNow()
  }, [saveNow])

  // Toggle fullscreen
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(!isFullScreen)
  }, [isFullScreen])

  // Calculate statistics
  const stats = {
    lineCount: content.split('\n').length,
    charCount: content.length,
    wordCount: content.split(/\s+/).filter(word => word.length > 0).length
  }

  // Loading state
  if (loading) {
    return (
      <div className={`file-editor ${className}`}>
        <EditorComponent
          value=""
          loading={true}
          height="600px"
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`file-editor ${className}`}>
        <EditorComponent
          value=""
          error={error}
          height="600px"
        />
      </div>
    )
  }

  // File not found
  if (!file) {
    return (
      <div className={`file-editor ${className}`}>
        <FileNotFound fileName="Unknown" />
      </div>
    )
  }

  return (
    <div className={`file-editor ${className} ${isFullScreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      {/* Editor */}
      <div className={`editor-container ${isFullScreen ? 'h-screen' : 'h-full'} flex flex-col overflow-hidden`}>
        <div className="flex-1 overflow-auto">
                     <EditorComponent
             value={content}
             onChange={handleContentChange}
             onSave={handleSave}
                         config={{
              theme: 'vscode-light',
              fontSize: 14,
              lineNumbers: true,
              lineWrapping: true,
              bracketMatching: true,
              autocompletion: true,
            }}
             placeholder="Start editing your LaTeX document..."
             height="100%"
             className="border-none"
           />
        </div>

        {/* Status bar */}
        <StatusBar
          fileName={file.name}
          fileType={file.file_type}
          lineCount={stats.lineCount}
          charCount={stats.charCount}
          wordCount={stats.wordCount}
          cursorLine={cursorPosition.line}
          cursorCol={cursorPosition.col}
          savedAt={lastSavedAt}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          saveError={saveError}
          isFullScreen={isFullScreen}
          onToggleFullScreen={toggleFullScreen}
        />
      </div>
    </div>
  )
}

export default FileEditor 