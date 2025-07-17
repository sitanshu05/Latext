'use client'

import { useState } from 'react'
import { FileEditor, type FileMetadata } from '@/components/editor/FileEditor'

// Sample file data for testing
const sampleFiles: FileMetadata[] = [
  {
    id: '1',
    name: 'sample-document.tex',
    file_type: 'tex',
    size: 2048,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:45:00Z',
    content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{graphicx}

\\title{Advanced LaTeX Document}
\\author{John Doe}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
This is a sample \\LaTeX{} document to demonstrate the \\textbf{FileEditor} component with all its features.

\\subsection{Mathematical Expressions}
Here are some mathematical expressions:

Inline math: $E = mc^2$ and $\\alpha + \\beta = \\gamma$.

Display math:
\\begin{equation}
  \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

\\begin{align}
  \\frac{d}{dx} \\sin(x) &= \\cos(x) \\\\
  \\frac{d}{dx} \\cos(x) &= -\\sin(x) \\\\
  \\frac{d}{dx} e^x &= e^x
\\end{align}

\\subsection{Lists and Formatting}
\\begin{itemize}
  \\item \\textbf{Bold text} formatting
  \\item \\textit{Italic text} formatting  
  \\item \\texttt{Typewriter text} formatting
  \\item \\emph{Emphasized text} formatting
\\end{itemize}

\\begin{enumerate}
  \\item First numbered item
  \\item Second numbered item with formula: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$
  \\item Third numbered item
\\end{enumerate}

\\section{Advanced Features}
\\subsection{Tables}
\\begin{table}[h]
\\centering
\\begin{tabular}{|l|c|r|}
\\hline
Left & Center & Right \\\\
\\hline
Data 1 & Data 2 & Data 3 \\\\
Data 4 & Data 5 & Data 6 \\\\
\\hline
\\end{tabular}
\\caption{Sample table}
\\label{tab:sample}
\\end{table}

\\subsection{References}
See Table~\\ref{tab:sample} for sample data.

% This is a comment
\\section{Conclusion}
This document demonstrates the comprehensive features of the FileEditor component including:
\\begin{itemize}
  \\item Professional LaTeX syntax highlighting
  \\item Full-screen editing mode
  \\item File metadata display
  \\item Status bar with cursor position
  \\item Multiple theme support
  \\item Real-time save functionality
\\end{itemize}

\\end{document}`
  },
  {
    id: '2',
    name: 'simple-note.tex',
    file_type: 'tex',
    size: 512,
    created_at: '2024-01-20T09:15:00Z',
    updated_at: null,
    content: `\\documentclass{article}

\\title{Simple Note}
\\author{Your Name}

\\begin{document}
\\maketitle

\\section{Quick Notes}
This is a simple \\LaTeX{} document for quick notes and testing.

% Comments work great
\\textbf{Bold text} and \\textit{italic text} formatting.

Math: $x^2 + y^2 = z^2$

\\end{document}`
  }
]

export default function FileEditorTestPage() {
  const [selectedFileId, setSelectedFileId] = useState<string>('1')
  const [files, setFiles] = useState<FileMetadata[]>(sampleFiles)

  const currentFile = files.find(f => f.id === selectedFileId) || null

  const handleSave = async (content: string) => {
    console.log('Saving file content:', content)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Update the file content
    setFiles(prev => prev.map(file => 
      file.id === selectedFileId 
        ? { ...file, content, updated_at: new Date().toISOString() }
        : file
    ))
    
    console.log('File saved successfully!')
  }

  const handleContentChange = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === selectedFileId 
        ? { ...file, content }
        : file
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 FileEditor Component Test</h1>

      {/* Features Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">✨ FileEditor Features</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
                     <div>
             <h3 className="font-medium mb-2">📊 File Information</h3>
             <ul className="space-y-1 text-gray-600">
               <li>• File name and type display</li>
               <li>• Clean, minimal interface</li>
               <li>• VS Code Light theme</li>
             </ul>
           </div>
          <div>
            <h3 className="font-medium mb-2">🎨 Enhanced Editor Layout</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Full-screen editing mode</li>
              <li>• Professional status bar</li>
              <li>• Theme selection</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">📈 Status Bar Info</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Cursor position (line, column)</li>
              <li>• Document statistics</li>
              <li>• Last saved timestamp</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">🔧 Advanced Features</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Error handling & file not found</li>
              <li>• Loading states</li>
              <li>• Async save functionality</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📁 Select File to Edit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedFileId === file.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold">{file.name}</div>
              <div className="text-sm text-gray-600">{file.file_type.toUpperCase()} File</div>
              <div className="text-xs text-gray-500 mt-1">
                {file.content.length} characters • {file.content.split('\n').length} lines
              </div>
              {file.updated_at && (
                <div className="text-xs text-gray-400">
                  Modified: {new Date(file.updated_at).toLocaleDateString()}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* FileEditor Component */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">🎯 FileEditor in Action</h3>
        <div className="border rounded-lg">
          {currentFile ? (
            <FileEditor
              file={currentFile}
              onSave={handleSave}
              onContentChange={handleContentChange}
              loading={false}
              className="file-editor-test"
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              No file selected
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-2">🧪 Test Instructions</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Basic Testing:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Edit content and see real-time updates</li>
              <li>• Click Save button or use Ctrl/Cmd+S</li>
              <li>• Switch between different files</li>
              <li>• Try different themes in dropdown</li>
            </ul>
          </div>
                     <div>
             <h4 className="font-medium mb-1">Advanced Testing:</h4>
             <ul className="space-y-1 text-gray-600">
               <li>• Click ⛶ fullscreen button for full-screen mode</li>
               <li>• Watch status bar for live statistics</li>
               <li>• Test LaTeX shortcuts (Ctrl/Cmd+B, Ctrl/Cmd+I)</li>
               <li>• Clean VS Code Light theme</li>
             </ul>
           </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 text-center">
        <div className="space-x-4">
          <a href="/editor-test" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🧪 Basic Editor Test
          </a>
          <a href="/project" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            📝 Use in Projects
          </a>
        </div>
      </div>
    </div>
  )
} 