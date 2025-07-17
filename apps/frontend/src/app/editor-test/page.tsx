'use client'

import { useState } from 'react'
import { EditorComponent, type EditorTheme, type EditorConfigOptions } from '@/components/editor/EditorComponent'

const sampleLatexContent = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{graphicx}

\\title{Sample LaTeX Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
This is a sample \\LaTeX{} document to test the CodeMirror editor with syntax highlighting.

\\subsection{Text Formatting}
Here are some examples of text formatting:
\\begin{itemize}
  \\item \\textbf{Bold text}
  \\item \\textit{Italic text}
  \\item \\texttt{Typewriter text}
  \\item \\emph{Emphasized text}
\\end{itemize}

\\subsection{Mathematics}
Inline math: $E = mc^2$ and $\\alpha + \\beta = \\gamma$.

Display math:
\\begin{equation}
  \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

\\begin{align}
  \\frac{d}{dx} \\sin(x) &= \\cos(x) \\\\
  \\frac{d}{dx} \\cos(x) &= -\\sin(x)
\\end{align}

\\subsection{Lists and Environments}
\\begin{enumerate}
  \\item First item
  \\item Second item with math: $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$
  \\item Third item
\\end{enumerate}

\\section{Conclusion}
This document demonstrates various \\LaTeX{} features with syntax highlighting.

% This is a comment
\\end{document}`

export default function EditorTestPage() {
  const [content, setContent] = useState(sampleLatexContent)
  const [theme, setTheme] = useState<EditorTheme>('light')
  const [fontSize, setFontSize] = useState(14)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [lineWrapping, setLineWrapping] = useState(true)

  const handleContentChange = (value: string) => {
    setContent(value)
  }

  const handleSave = () => {
    console.log('Save triggered!')
    alert('Save function called! Check console for content.')
    console.log('Current content:', content)
  }

  const handleFind = () => {
    console.log('Find triggered!')
  }

  const config: EditorConfigOptions = {
    theme,
    fontSize,
    lineNumbers,
    lineWrapping,
    bracketMatching: true,
    autocompletion: true,
    searchHighlight: true,
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CodeMirror LaTeX Editor Test</h1>
      
      {/* Controls */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Editor Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value as EditorTheme)}
              className="w-full p-2 border rounded"
            >
              <optgroup label="Built-in Themes">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="github-light">GitHub Light</option>
                <option value="github-dark">GitHub Dark</option>
                <option value="vscode-light">VS Code Light</option>
                <option value="vscode-dark">VS Code Dark</option>
              </optgroup>
              <optgroup label="Custom Color Themes">
                <option value="ocean">🌊 Ocean (Blue)</option>
                <option value="forest">🌲 Forest (Green)</option>
                <option value="sunset">🌅 Sunset (Orange)</option>
                <option value="purple">💜 Purple (Violet)</option>
              </optgroup>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <input 
              type="range" 
              min="10" 
              max="24" 
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{fontSize}px</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.checked)}
                className="mr-2"
              />
              Line Numbers
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={lineWrapping}
                onChange={(e) => setLineWrapping(e.target.checked)}
                className="mr-2"
              />
              Line Wrapping
            </label>
          </div>
        </div>
      </div>

      {/* Color Theme Preview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">🎨 Current Theme: {theme}</h3>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Keywords</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Strings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>Comments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span>Math</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl/Cmd + S</kbd> Save</div>
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl/Cmd + F</kbd> Find</div>
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl/Cmd + B</kbd> Bold</div>
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl/Cmd + I</kbd> Italic</div>
        </div>
      </div>

      {/* Editor */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">LaTeX Editor</h2>
          <div className="space-x-2">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Document
            </button>
            <button 
              onClick={() => setContent(sampleLatexContent)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reset Content
            </button>
          </div>
        </div>
        
        <EditorComponent
          value={content}
          onChange={handleContentChange}
          onSave={handleSave}
          onFind={handleFind}
          config={config}
          placeholder="Start typing your LaTeX document..."
          height="600px"
          className="border rounded-lg"
        />
      </div>

      {/* Stats */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold mb-2">Document Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>Characters: <span className="font-mono">{content.length}</span></div>
          <div>Lines: <span className="font-mono">{content.split('\\n').length}</span></div>
          <div>Words: <span className="font-mono">{content.split(/\\s+/).filter(word => word.length > 0).length}</span></div>
        </div>
      </div>
    </div>
  )
} 