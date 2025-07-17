'use client'

import React, { useState } from 'react'
import { X, Plus, FileText, MoreHorizontal } from 'lucide-react'
import { FileMetadata } from './FileEditor'

export interface FileTabsProps {
  files: FileMetadata[]
  currentFileId: string | null
  onFileSelect: (fileId: string) => void
  onFileClose: (fileId: string) => void
  onFileCreate: () => void
  onFileRename: (fileId: string, newName: string) => void
  onFileDelete: (fileId: string) => void
  className?: string
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  currentFileId,
  onFileSelect,
  onFileClose,
  onFileCreate,
  onFileRename,
  onFileDelete,
  className = ''
}) => {
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [showMenuForFile, setShowMenuForFile] = useState<string | null>(null)

  const handleRenameStart = (file: FileMetadata) => {
    setRenamingFileId(file.id)
    setRenameValue(file.name)
  }

  const handleRenameSubmit = () => {
    if (renamingFileId && renameValue.trim()) {
      onFileRename(renamingFileId, renameValue.trim())
    }
    setRenamingFileId(null)
    setRenameValue('')
  }

  const handleRenameCancel = () => {
    setRenamingFileId(null)
    setRenameValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit()
    } else if (e.key === 'Escape') {
      handleRenameCancel()
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'tex':
        return <FileText className="w-4 h-4" />
      case 'bib':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className={`file-tabs ${className} bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center overflow-x-auto">
        {/* File Tabs */}
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-tab flex items-center min-w-0 flex-shrink-0 px-4 py-2 border-r border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
              currentFileId === file.id
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => onFileSelect(file.id)}
          >
            {/* File Icon */}
            <div className="mr-2 text-gray-500 dark:text-gray-400">
              {getFileIcon(file.file_type)}
            </div>

            {/* File Name */}
            <div className="flex-1 min-w-0">
              {renamingFileId === file.id ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleRenameSubmit}
                  className="w-full bg-transparent border-none outline-none text-sm"
                  autoFocus
                />
              ) : (
                <span className="text-sm font-medium truncate" title={file.name}>
                  {file.name}
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onFileClose(file.id)
              }}
              className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-60 hover:opacity-100"
              title="Close file"
            >
              <X className="w-3 h-3" />
            </button>

            {/* More Options Menu */}
            <div className="relative ml-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenuForFile(showMenuForFile === file.id ? null : file.id)
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-60 hover:opacity-100"
                title="More options"
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>

              {/* Dropdown Menu */}
              {showMenuForFile === file.id && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRenameStart(file)
                      setShowMenuForFile(null)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileDelete(file.id)
                      setShowMenuForFile(null)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* New File Button */}
        <button
          onClick={onFileCreate}
          className="flex items-center px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Create new file"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Click outside to close menus */}
      {showMenuForFile && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenuForFile(null)}
        />
      )}
    </div>
  )
}

export default FileTabs 