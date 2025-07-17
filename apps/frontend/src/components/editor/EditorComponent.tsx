'use client'

import React, { useCallback, useRef, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { githubLight, githubDark } from '@uiw/codemirror-theme-github'
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode'
import { searchKeymap } from '@codemirror/search'
import { defaultKeymap, historyKeymap } from '@codemirror/commands'
import { keymap } from '@codemirror/view'
import { autocompletion } from '@codemirror/autocomplete'
import { bracketMatching } from '@codemirror/language'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/view'
import { highlightSelectionMatches } from '@codemirror/search'
import { history } from '@codemirror/commands'
import { latexLanguage } from './latex-language'
import { createCustomTheme } from './custom-themes'

// Theme configuration
export type EditorTheme = 'light' | 'dark' | 'github-light' | 'github-dark' | 'vscode-light' | 'vscode-dark' | 'ocean' | 'forest' | 'sunset' | 'purple'

// Editor configuration options
export interface EditorConfigOptions {
  theme?: EditorTheme
  fontSize?: number
  fontFamily?: string
  lineNumbers?: boolean
  lineWrapping?: boolean
  bracketMatching?: boolean
  autocompletion?: boolean
  searchHighlight?: boolean
  tabSize?: number
  indentWithTabs?: boolean
  readOnly?: boolean
}

// Component props interface
export interface EditorComponentProps {
  value: string
  onChange?: (value: string) => void
  onSave?: () => void
  onFind?: () => void
  config?: EditorConfigOptions
  placeholder?: string
  className?: string
  height?: string
  width?: string
  loading?: boolean
  error?: string | null
}

// Default editor configuration
const defaultConfig: EditorConfigOptions = {
  theme: 'vscode-light',
  fontSize: 14,
  fontFamily: 'Fira Code, Monaco, Consolas, monospace',
  lineNumbers: true,
  lineWrapping: true,
  bracketMatching: true,
  autocompletion: true,
  searchHighlight: true,
  tabSize: 2,
  indentWithTabs: false,
  readOnly: false,
}

// Loading component
const EditorLoading: React.FC = () => (
  <div className="flex items-center justify-center h-96 bg-gray-50 dark:bg-gray-900 rounded-lg border">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading Editor...</p>
    </div>
  </div>
)

// Error component
const EditorError: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    <div className="text-center space-y-4 max-w-md">
      <div className="text-red-600 dark:text-red-400">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Editor Error</h3>
        <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
      </div>
    </div>
  </div>
)

// Get theme extension based on theme name
const getThemeExtension = (theme: EditorTheme) => {
  // Custom themes
  if (['ocean', 'forest', 'sunset', 'purple'].includes(theme)) {
    return createCustomTheme(theme as 'ocean' | 'forest' | 'sunset' | 'purple')
  }
  
  // Built-in themes
  switch (theme) {
    case 'dark':
      return oneDark
    case 'github-light':
      return githubLight
    case 'github-dark':
      return githubDark
    case 'vscode-light':
      return vscodeLight
    case 'vscode-dark':
      return vscodeDark
    case 'light':
    default:
      return githubLight
  }
}

// Main Editor Component
export const EditorComponent: React.FC<EditorComponentProps> = ({
  value,
  onChange,
  onSave,
  onFind,
  config = {},
  placeholder = 'Start typing your LaTeX document...',
  className = '',
  height = '600px',
  width = '100%',
  loading = false,
  error = null,
}) => {
  const editorRef = useRef<any>(null)
  const mergedConfig = { ...defaultConfig, ...config }

  // Handle content change
  const handleChange = useCallback(
    (val: string) => {
      onChange?.(val)
    },
    [onChange]
  )

  // Create keyboard shortcuts
  const createKeymap = useCallback(() => {
    return keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
      {
        key: 'Ctrl-s',
        mac: 'Cmd-s',
        run: () => {
          onSave?.()
          return true
        },
      },
      {
        key: 'Ctrl-f',
        mac: 'Cmd-f',
        run: () => {
          onFind?.()
          return true
        },
      },
      {
        key: 'Ctrl-b',
        mac: 'Cmd-b',
        run: (view) => {
          const { state } = view
          const { from, to } = state.selection.main
          if (from !== to) {
            const selectedText = state.sliceDoc(from, to)
            const replacement = `\\textbf{${selectedText}}`
            view.dispatch({
              changes: { from, to, insert: replacement },
              selection: { anchor: from + replacement.length }
            })
          } else {
            const replacement = '\\textbf{}'
            view.dispatch({
              changes: { from, insert: replacement },
              selection: { anchor: from + replacement.length - 1 }
            })
          }
          return true
        },
      },
      {
        key: 'Ctrl-i',
        mac: 'Cmd-i',
        run: (view) => {
          const { state } = view
          const { from, to } = state.selection.main
          if (from !== to) {
            const selectedText = state.sliceDoc(from, to)
            const replacement = `\\textit{${selectedText}}`
            view.dispatch({
              changes: { from, to, insert: replacement },
              selection: { anchor: from + replacement.length }
            })
          } else {
            const replacement = '\\textit{}'
            view.dispatch({
              changes: { from, insert: replacement },
              selection: { anchor: from + replacement.length - 1 }
            })
          }
          return true
        },
      },
    ])
  }, [onSave, onFind])

    // Create editor extensions
  const createExtensions = useCallback(() => {
    const themeExtensions = getThemeExtension(mergedConfig.theme!)
    const extensions = [
      latexLanguage,
      createKeymap(),
      history(),
      // Apply theme extensions (can be single extension or array)
      ...(Array.isArray(themeExtensions) ? themeExtensions : [themeExtensions]),
      EditorView.theme({
        '&': {
          fontSize: `${mergedConfig.fontSize || 14}px`,
          fontFamily: mergedConfig.fontFamily || 'monospace',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '200px',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          borderRadius: '8px',
        },
        '.cm-scroller': {
          fontFamily: mergedConfig.fontFamily || 'monospace',
        },
      }),
    ]

    // Add optional extensions based on config
    if (mergedConfig.lineNumbers) {
      extensions.push(lineNumbers())
      extensions.push(highlightActiveLineGutter())
    }

    if (mergedConfig.bracketMatching) {
      extensions.push(bracketMatching())
    }

    if (mergedConfig.autocompletion) {
      extensions.push(autocompletion())
    }

    if (mergedConfig.searchHighlight) {
      extensions.push(highlightSelectionMatches())
    }

    if (mergedConfig.lineWrapping) {
      extensions.push(EditorView.lineWrapping)
    }

    // Tab size configuration
    extensions.push(
      EditorState.tabSize.of(mergedConfig.tabSize || 2)
    )

    return extensions
  }, [mergedConfig, createKeymap])

  // Show loading state
  if (loading) {
    return <EditorLoading />
  }

  // Show error state
  if (error) {
    return <EditorError error={error} />
  }

  return (
    <div className={`editor-wrapper ${className}`} style={{ height, width }}>
        <CodeMirror
          ref={editorRef}
          value={value}
          placeholder={placeholder}
          height={height}
          width={width}
          extensions={createExtensions()}
          onChange={handleChange}
          readOnly={mergedConfig.readOnly}
          className="border rounded-lg"
        />
    </div>
  )
}

export default EditorComponent 