'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FileEditor, type FileMetadata } from './FileEditor'
import { FileTabs } from './FileTabs'
import { createFile, renameFile, deleteFile } from '@/lib/services/projects'
import { AlertTriangle } from 'lucide-react'

export interface MultiFileEditorProps {
  projectId: string
  files: FileMetadata[]
  onFilesChange: (files: FileMetadata[]) => void
  className?: string
}

export const MultiFileEditor: React.FC<MultiFileEditorProps> = ({
  projectId,
  files,
  onFilesChange,
  className = ''
}) => {
  const [currentFileId, setCurrentFileId] = useState<string | null>(null)
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState('tex')
  const [error, setError] = useState<string | null>(null)

  // Initialize current file when files change
  useEffect(() => {
    if (files.length > 0 && !currentFileId) {
      setCurrentFileId(files[0].id)
    } else if (files.length === 0) {
      setCurrentFileId(null)
    } else if (currentFileId && !files.find(f => f.id === currentFileId)) {
      // Current file was deleted, switch to first available
      setCurrentFileId(files[0].id)
    }
  }, [files, currentFileId])

  // Initialize file contents
  useEffect(() => {
    const contents: Record<string, string> = {}
    files.forEach(file => {
      contents[file.id] = file.content
    })
    setFileContents(contents)
  }, [files])

  // Get open files (files that have been loaded into editor)
  const openFiles = files.filter(f => fileContents[f.id] !== undefined)
  const currentFile = files.find(f => f.id === currentFileId) || null

  // Handle file content changes
  const handleContentChange = useCallback((content: string) => {
    if (currentFileId) {
      setFileContents(prev => ({
        ...prev,
        [currentFileId]: content
      }))
      setUnsavedFiles(prev => new Set(prev).add(currentFileId))
    }
  }, [currentFileId])

  // Handle file save
  const handleSave = useCallback(async (content: string) => {
    if (!currentFileId) return

    try {
      // Update the file content in our state
      setFileContents(prev => ({
        ...prev,
        [currentFileId]: content
      }))
      
      // Remove from unsaved files
      setUnsavedFiles(prev => {
        const newSet = new Set(prev)
        newSet.delete(currentFileId)
        return newSet
      })

      // Update the files array with new content
      onFilesChange(files.map(file => 
        file.id === currentFileId 
          ? { ...file, content, updated_at: new Date().toISOString() }
          : file
      ))
    } catch (error) {
      console.error('Save failed:', error)
      throw error
    }
  }, [currentFileId, files, onFilesChange])

  // Handle file selection
  const handleFileSelect = useCallback((fileId: string) => {
    setCurrentFileId(fileId)
  }, [])

  // Handle file close (only close tab, don't remove from project)
  const handleFileClose = useCallback((fileId: string) => {
    // Remove from unsaved files
    setUnsavedFiles(prev => {
      const newSet = new Set(prev)
      newSet.delete(fileId)
      return newSet
    })

    // Remove from file contents
    setFileContents(prev => {
      const newContents = { ...prev }
      delete newContents[fileId]
      return newContents
    })

    // If closing current file, switch to another
    if (fileId === currentFileId) {
      const remainingOpenFiles = Object.keys(fileContents).filter(id => id !== fileId)
      if (remainingOpenFiles.length > 0) {
        setCurrentFileId(remainingOpenFiles[0])
      } else if (files.length > 0) {
        // If no open files, open the first project file
        setCurrentFileId(files[0].id)
      }
    }
  }, [files, currentFileId, fileContents])

  // Handle file creation
  const handleFileCreate = useCallback(() => {
    setShowCreateDialog(true)
  }, [])

  const handleCreateFile = useCallback(async () => {
    if (!newFileName.trim()) return

    try {
      const { file, error } = await createFile(projectId, newFileName.trim(), newFileType)
      
      if (error) {
        setError(error)
        return
      }

      if (file) {
        const newFileMetadata: FileMetadata = {
          id: file.id,
          name: file.name,
          file_type: file.file_type,
          size: file.content.length,
          created_at: file.created_at,
          updated_at: file.updated_at,
          content: file.content
        }

        onFilesChange([...files, newFileMetadata])
        setCurrentFileId(file.id)
        setFileContents(prev => ({
          ...prev,
          [file.id]: file.content
        }))
      }

      setShowCreateDialog(false)
      setNewFileName('')
      setNewFileType('tex')
      setError(null)
    } catch (err) {
      setError('Failed to create file')
    }
  }, [projectId, newFileName, newFileType, files, onFilesChange])

  // Handle file rename
  const handleFileRename = useCallback(async (fileId: string, newName: string) => {
    try {
      const { success, error } = await renameFile(fileId, newName)
      
      if (error) {
        setError(error)
        return
      }

      if (success) {
        onFilesChange(files.map(file => 
          file.id === fileId 
            ? { ...file, name: newName, updated_at: new Date().toISOString() }
            : file
        ))
      }
    } catch (err) {
      setError('Failed to rename file')
    }
  }, [files, onFilesChange])

  // Handle file delete (remove from project)
  const handleFileDelete = useCallback(async (fileId: string) => {
    if (files.length <= 1) {
      setError('Cannot delete the last file')
      return
    }

    try {
      const { success, error } = await deleteFile(fileId)
      
      if (error) {
        setError(error)
        return
      }

      if (success) {
        // Remove from unsaved files
        setUnsavedFiles(prev => {
          const newSet = new Set(prev)
          newSet.delete(fileId)
          return newSet
        })

        // Remove from file contents
        setFileContents(prev => {
          const newContents = { ...prev }
          delete newContents[fileId]
          return newContents
        })

        // Remove from files array
        onFilesChange(files.filter(f => f.id !== fileId))

        // If deleting current file, switch to another
        if (fileId === currentFileId) {
          const remainingFiles = files.filter(f => f.id !== fileId)
          setCurrentFileId(remainingFiles[0].id)
        }
      }
    } catch (err) {
      setError('Failed to delete file')
    }
  }, [files, currentFileId, onFilesChange])

  // Create file dialog
  const CreateFileDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Create New File</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">File Name</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g., chapter1.tex"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">File Type</label>
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tex">LaTeX (.tex)</option>
              <option value="bib">Bibliography (.bib)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowCreateDialog(false)
              setNewFileName('')
              setError(null)
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateFile}
            disabled={!newFileName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`multi-file-editor ${className} flex flex-col h-full overflow-hidden`}>
      {/* File Tabs */}
      <FileTabs
        files={openFiles}
        currentFileId={currentFileId}
        onFileSelect={handleFileSelect}
        onFileClose={handleFileClose}
        onFileCreate={handleFileCreate}
        onFileRename={handleFileRename}
        onFileDelete={handleFileDelete}
      />

      {/* File Editor */}
      <div className="flex-1 overflow-auto">
        {currentFile ? (
          <FileEditor
            file={{
              ...currentFile,
              content: fileContents[currentFile.id] || currentFile.content
            }}
            onSave={handleSave}
            onContentChange={handleContentChange}
            className="h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No files available
          </div>
        )}
      </div>

      {/* Create File Dialog */}
      {showCreateDialog && <CreateFileDialog />}
    </div>
  )
}

export default MultiFileEditor 