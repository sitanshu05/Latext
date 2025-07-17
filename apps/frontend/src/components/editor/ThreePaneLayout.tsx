'use client'

import React, { useState, useMemo } from 'react'
import { FileExplorer, type FileExplorerItem } from './FileExplorer'
import { MultiFileEditor } from './MultiFileEditor'
import { Preview } from './Preview'
import { type FileMetadata } from './FileEditor'

export interface ThreePaneLayoutProps {
  projectId: string
  files: FileMetadata[]
  onFilesChange: (files: FileMetadata[]) => void
  className?: string
}

export const ThreePaneLayout: React.FC<ThreePaneLayoutProps> = ({
  projectId,
  files,
  onFilesChange,
  className = ''
}) => {
  const [selectedExplorerItem, setSelectedExplorerItem] = useState<string | null>(null)
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)

  // Convert files to explorer items (flat structure for now)
  const explorerItems: FileExplorerItem[] = useMemo(() => {
    return files.map(file => ({
      id: file.id,
      name: file.name,
      type: 'file' as const,
      fileType: file.file_type,
      isOpen: false
    }))
  }, [files])

  // Get main.tex content for preview (always preview main.tex)
  const mainTexFile = files.find(f => f.name === 'main.tex')
  const previewContent = mainTexFile?.content || ''

  // Handle explorer item selection
  const handleExplorerItemSelect = (itemId: string) => {
    setSelectedExplorerItem(itemId)
    setCurrentFileId(itemId)
  }

  // Handle file creation in explorer
  const handleExplorerItemCreate = (parentId: string | null, type: 'file' | 'folder') => {
    if (type === 'file') {
      // For now, just create a new file at root level
      console.log('Create new file')
      // This will be implemented when we add file creation functionality
    } else {
      console.log('Create new folder')
      // This will be implemented when we add folder functionality
    }
  }

  // Handle explorer item rename
  const handleExplorerItemRename = (itemId: string, newName: string) => {
    console.log('Rename item:', itemId, 'to:', newName)
    // This will be implemented when we add rename functionality
  }

  // Handle explorer item delete
  const handleExplorerItemDelete = (itemId: string) => {
    console.log('Delete item:', itemId)
    // This will be implemented when we add delete functionality
  }

  // Handle file selection from editor
  const handleEditorFileSelect = (fileId: string) => {
    setCurrentFileId(fileId)
    setSelectedExplorerItem(fileId)
  }

  // Handle compilation
  const handleCompile = async () => {
    console.log('Compile LaTeX to PDF')
    // This will be implemented when we add PDF compilation
  }

  return (
    <div className={`three-pane-layout ${className} flex h-full overflow-hidden`}>
      {/* Left Pane: File Explorer */}
      <div className="w-72 flex-shrink-0 overflow-hidden">
        <FileExplorer
          items={explorerItems}
          selectedItemId={selectedExplorerItem}
          onItemSelect={handleExplorerItemSelect}
          onItemCreate={handleExplorerItemCreate}
          onItemRename={handleExplorerItemRename}
          onItemDelete={handleExplorerItemDelete}
          className="h-full"
        />
      </div>

      {/* Center Pane: Multi-File Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MultiFileEditor
          projectId={projectId}
          files={files}
          onFilesChange={onFilesChange}
          className="h-full"
        />
      </div>

      {/* Right Pane: Preview */}
      <div className="w-96 flex-shrink-0 overflow-hidden">
        <Preview
          content={previewContent}
          fileName={mainTexFile?.name}
          fileType={mainTexFile?.file_type}
          onCompile={handleCompile}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default ThreePaneLayout 