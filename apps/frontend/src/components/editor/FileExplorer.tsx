'use client'

import React, { useState } from 'react'
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal,
  Plus,
  FileImage,
  File
} from 'lucide-react'
import { FileMetadata } from './FileEditor'

export interface FileExplorerItem {
  id: string
  name: string
  type: 'file' | 'folder'
  fileType?: string
  children?: FileExplorerItem[]
  isOpen?: boolean
}

export interface FileExplorerProps {
  items: FileExplorerItem[]
  selectedItemId: string | null
  onItemSelect: (itemId: string) => void
  onItemCreate: (parentId: string | null, type: 'file' | 'folder') => void
  onItemRename: (itemId: string, newName: string) => void
  onItemDelete: (itemId: string) => void
  className?: string
}

const FileExplorerItem: React.FC<{
  item: FileExplorerItem
  level: number
  selectedItemId: string | null
  onItemSelect: (itemId: string) => void
  onToggleFolder: (itemId: string) => void
  onItemCreate: (parentId: string | null, type: 'file' | 'folder') => void
  onItemRename: (itemId: string, newName: string) => void
  onItemDelete: (itemId: string) => void
}> = ({
  item,
  level,
  selectedItemId,
  onItemSelect,
  onToggleFolder,
  onItemCreate,
  onItemRename,
  onItemDelete
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(item.name)

  const isSelected = selectedItemId === item.id
  const isFolder = item.type === 'folder'
  const isOpen = item.isOpen || false

  const getFileIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case 'tex':
        return <FileText className="w-4 h-4" />
      case 'bib':
        return <FileText className="w-4 h-4" />
      case 'pdf':
        return <File className="w-4 h-4" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FileImage className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== item.name) {
      onItemRename(item.id, renameValue.trim())
    }
    setIsRenaming(false)
  }

  const handleRenameCancel = () => {
    setRenameValue(item.name)
    setIsRenaming(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit()
    } else if (e.key === 'Escape') {
      handleRenameCancel()
    }
  }

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
          isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onItemSelect(item.id)}
      >
        {/* Folder/File Icon */}
        <div className="flex items-center mr-1">
          {isFolder ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
              {isOpen ? (
                <FolderOpen className="w-4 h-4 text-yellow-500" />
              ) : (
                <Folder className="w-4 h-4 text-yellow-500" />
              )}
            </>
          ) : (
            getFileIcon(item.fileType)
          )}
        </div>

        {/* Item Name */}
        <div className="flex-1 min-w-0">
          {isRenaming ? (
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
            <span className="text-sm truncate" title={item.name}>
              {item.name}
            </span>
          )}
        </div>

        {/* More Options Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-60 hover:opacity-100"
            title="More options"
          >
            <MoreHorizontal className="w-3 h-3" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              {isFolder && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onItemCreate(item.id, 'file')
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    New File
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onItemCreate(item.id, 'folder')
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    New Folder
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsRenaming(true)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onItemDelete(item.id)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Folder Toggle */}
      {isFolder && (
        <div
          className="absolute left-0 top-0 w-full h-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFolder(item.id)
          }}
        />
      )}

      {/* Children */}
      {isFolder && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileExplorerItem
              key={child.id}
              item={child}
              level={level + 1}
              selectedItemId={selectedItemId}
              onItemSelect={onItemSelect}
              onToggleFolder={onToggleFolder}
              onItemCreate={onItemCreate}
              onItemRename={onItemRename}
              onItemDelete={onItemDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  items,
  selectedItemId,
  onItemSelect,
  onItemCreate,
  onItemRename,
  onItemDelete,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className={`file-explorer ${className} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">EXPLORER</h3>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Add new item"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Root Level Menu */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  onItemCreate(null, 'file')
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                New File
              </button>
              <button
                onClick={() => {
                  onItemCreate(null, 'folder')
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                New Folder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative">
          {items.map((item) => (
            <FileExplorerItem
              key={item.id}
              item={item}
              level={0}
              selectedItemId={selectedItemId}
              onItemSelect={onItemSelect}
              onToggleFolder={(itemId) => {
                // Toggle folder open/close state
                console.log('Toggle folder:', itemId)
              }}
              onItemCreate={onItemCreate}
              onItemRename={onItemRename}
              onItemDelete={onItemDelete}
            />
          ))}
        </div>
      </div>

      {/* Click outside to close menus */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

export default FileExplorer 