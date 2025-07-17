'use client'

import { Editor } from '@monaco-editor/react'
import { useState, useRef } from 'react'
import { editor, KeyMod, KeyCode } from 'monaco-editor'

export interface EditorConfigOptions {
  fontSize?: number
  fontFamily?: string
  tabSize?: number
  minimap?: boolean
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  scrollBeyondLastLine?: boolean
  automaticLayout?: boolean
}

export interface EditorComponentProps {
  value?: string
  defaultValue?: string
  language?: string
  theme?: 'vs-light' | 'vs-dark' | 'hc-black' | 'hc-light'
  height?: string
  width?: string
  readOnly?: boolean
  config?: EditorConfigOptions
  onChange?: (value: string | undefined) => void
  onMount?: (editor: editor.IStandaloneCodeEditor) => void
  onSave?: () => void
  onFind?: () => void
}

export default function EditorComponent({
  value,
  defaultValue = '',
  language = 'plaintext',
  theme = 'vs-dark',
  height = '500px',
  width = '100%',
  readOnly = false,
  config = {},
  onChange,
  onMount,
  onSave,
  onFind,
}: EditorComponentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Merge config with defaults
  const editorOptions = {
    readOnly,
    fontSize: config.fontSize ?? 14,
    fontFamily: config.fontFamily ?? 'Monaco, "Lucida Console", Courier, monospace',
    tabSize: config.tabSize ?? 2,
    minimap: { enabled: config.minimap ?? false },
    lineNumbers: config.lineNumbers ?? 'on',
    wordWrap: config.wordWrap ?? 'on',
    automaticLayout: config.automaticLayout ?? true,
    scrollBeyondLastLine: config.scrollBeyondLastLine ?? false,
  }

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    try {
      editorRef.current = editor
      setIsLoading(false)
      setHasError(false)
      setErrorMessage('')
      
      // Add keyboard shortcuts
      if (onSave) {
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyS, () => {
          onSave()
        })
      }

      if (onFind) {
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyF, () => {
          onFind()
        })
      }

      // LaTeX-specific shortcuts
      if (language === 'latex') {
        // Bold text: Ctrl/Cmd+B
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyB, () => {
          const selection = editor.getSelection()
          if (selection && !selection.isEmpty()) {
            const text = editor.getModel()?.getValueInRange(selection)
            if (text) {
              editor.executeEdits('latex-bold', [{
                range: selection,
                text: `\\textbf{${text}}`
              }])
            }
          }
        })

        // Italic text: Ctrl/Cmd+I
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyI, () => {
          const selection = editor.getSelection()
          if (selection && !selection.isEmpty()) {
            const text = editor.getModel()?.getValueInRange(selection)
            if (text) {
              editor.executeEdits('latex-italic', [{
                range: selection,
                text: `\\textit{${text}}`
              }])
            }
          }
        })
      }
      
      // Call the external onMount callback if provided
      if (onMount) {
        onMount(editor)
      }
    } catch (error) {
      setIsLoading(false)
      setHasError(true)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize editor')
    }
  }

  const handleEditorValidationError = () => {
    setHasError(true)
    setErrorMessage('Editor validation failed')
  }

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <div style={{ position: 'relative', height, width }}>
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: '10px' }}>Loading editor...</div>
          <div 
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e0e0e0',
              borderTop: '2px solid #007acc',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>
      )}

      {hasError && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff5f5',
            border: '1px solid #fed7d7',
            color: '#c53030',
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Editor Error</div>
          <div style={{ fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>
            {errorMessage}
          </div>
        </div>
      )}
      
      {!hasError && (
        <Editor
          height={height}
          width={width}
          language={language}
          theme={theme}
          value={value}
          defaultValue={defaultValue}
          options={editorOptions}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          onValidate={handleEditorValidationError}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 