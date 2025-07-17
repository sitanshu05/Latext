'use client'

import React, { useState } from 'react'
import { Eye, Download, RefreshCw, FileText, Image } from 'lucide-react'

export interface PreviewProps {
  content?: string
  fileName?: string
  fileType?: string
  onCompile?: () => void
  className?: string
}

export const Preview: React.FC<PreviewProps> = ({
  content,
  fileName,
  fileType,
  onCompile,
  className = ''
}) => {
  const [isCompiling, setIsCompiling] = useState(false)
  const [previewMode, setPreviewMode] = useState<'pdf' | 'latex'>('pdf')

  const handleCompile = async () => {
    if (!onCompile) return
    
    setIsCompiling(true)
    try {
      await onCompile()
    } catch (error) {
      console.error('Compilation failed:', error)
    } finally {
      setIsCompiling(false)
    }
  }

  const getFileIcon = () => {
    switch (fileType?.toLowerCase()) {
      case 'tex':
        return <FileText className="w-4 h-4" />
      case 'pdf':
        return <FileText className="w-4 h-4" />
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <Image className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className={`preview ${className} bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">PREVIEW</h3>
          {fileName && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              {getFileIcon()}
              <span>{fileName}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Preview Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setPreviewMode('pdf')}
              className={`px-2 py-1 text-xs rounded ${
                previewMode === 'pdf'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              PDF
            </button>
            <button
              onClick={() => setPreviewMode('latex')}
              className={`px-2 py-1 text-xs rounded ${
                previewMode === 'latex'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              LaTeX
            </button>
          </div>

          {/* Compile Button */}
          {fileType === 'tex' && (
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
              title="Compile LaTeX to PDF"
            >
              {isCompiling ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
              <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
            </button>
          )}

          {/* Download Button */}
          <button
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        {previewMode === 'pdf' ? (
          <div className="p-4">
            {content ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[600px]">
                <div className="text-center text-gray-500 dark:text-gray-400 mb-4">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">PDF Preview</p>
                  <p className="text-xs mt-1">Compile LaTeX to see rendered PDF</p>
                </div>
                
                {/* Placeholder for PDF content */}
                <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-6 min-h-[500px]">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <p className="text-lg font-medium mb-2">PDF Preview Area</p>
                    <p className="text-sm">This area will display the compiled PDF when ready</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Preview Available</p>
                  <p className="text-sm">Select a file to preview its content</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {content ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-4">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                    {content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No Content</p>
                  <p className="text-sm">Select a file to view its LaTeX source</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span>Preview Mode: {previewMode.toUpperCase()}</span>
          <span>{fileName ? `File: ${fileName}` : 'No file selected'}</span>
        </div>
      </div>
    </div>
  )
}

export default Preview 