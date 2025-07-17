import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// Custom color schemes
export const customThemes = {
  // Ocean theme - blue/teal colors
  ocean: EditorView.theme({
    '&': {
      color: '#2c3e50',
      backgroundColor: '#ecf0f1'
    },
    '.cm-content': {
      padding: '16px',
      backgroundColor: '#ecf0f1',
      caretColor: '#3498db'
    },
    '.cm-focused': {
      outline: '2px solid #3498db',
      outlineOffset: '-2px'
    },
    '.cm-editor': {
      borderRadius: '8px',
      border: '1px solid #bdc3c7'
    },
    '.cm-scroller': {
      fontFamily: 'Fira Code, Monaco, Consolas, monospace'
    },
    '.cm-activeLine': {
      backgroundColor: '#d5dbdb'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#d5dbdb'
    },
    '.cm-gutters': {
      backgroundColor: '#bdc3c7',
      color: '#7f8c8d',
      border: 'none'
    },
    '.cm-lineNumbers': {
      color: '#95a5a6'
    },
    '.cm-cursor': {
      borderLeftColor: '#3498db'
    },
    '.cm-selectionBackground': {
      backgroundColor: '#85c1e9'
    }
  }, { dark: false }),

  // Forest theme - green colors
  forest: EditorView.theme({
    '&': {
      color: '#2d5016',
      backgroundColor: '#f1f8e9'
    },
    '.cm-content': {
      padding: '16px',
      backgroundColor: '#f1f8e9',
      caretColor: '#4caf50'
    },
    '.cm-focused': {
      outline: '2px solid #4caf50',
      outlineOffset: '-2px'
    },
    '.cm-editor': {
      borderRadius: '8px',
      border: '1px solid #a5d6a7'
    },
    '.cm-activeLine': {
      backgroundColor: '#e8f5e8'
    },
    '.cm-gutters': {
      backgroundColor: '#c8e6c9',
      color: '#66bb6a',
      border: 'none'
    },
    '.cm-lineNumbers': {
      color: '#81c784'
    },
    '.cm-cursor': {
      borderLeftColor: '#4caf50'
    },
    '.cm-selectionBackground': {
      backgroundColor: '#a5d6a7'
    }
  }, { dark: false }),

  // Sunset theme - orange/red colors
  sunset: EditorView.theme({
    '&': {
      color: '#5d4037',
      backgroundColor: '#fff3e0'
    },
    '.cm-content': {
      padding: '16px',
      backgroundColor: '#fff3e0',
      caretColor: '#ff9800'
    },
    '.cm-focused': {
      outline: '2px solid #ff9800',
      outlineOffset: '-2px'
    },
    '.cm-editor': {
      borderRadius: '8px',
      border: '1px solid #ffcc02'
    },
    '.cm-activeLine': {
      backgroundColor: '#ffe0b2'
    },
    '.cm-gutters': {
      backgroundColor: '#ffcc02',
      color: '#f57c00',
      border: 'none'
    },
    '.cm-lineNumbers': {
      color: '#ff9800'
    },
    '.cm-cursor': {
      borderLeftColor: '#ff9800'
    },
    '.cm-selectionBackground': {
      backgroundColor: '#ffcc02'
    }
  }, { dark: false }),

  // Purple theme - purple/violet colors
  purple: EditorView.theme({
    '&': {
      color: '#4a148c',
      backgroundColor: '#f3e5f5'
    },
    '.cm-content': {
      padding: '16px',
      backgroundColor: '#f3e5f5',
      caretColor: '#9c27b0'
    },
    '.cm-focused': {
      outline: '2px solid #9c27b0',
      outlineOffset: '-2px'
    },
    '.cm-editor': {
      borderRadius: '8px',
      border: '1px solid #ce93d8'
    },
    '.cm-activeLine': {
      backgroundColor: '#e1bee7'
    },
    '.cm-gutters': {
      backgroundColor: '#ce93d8',
      color: '#8e24aa',
      border: 'none'
    },
    '.cm-lineNumbers': {
      color: '#ba68c8'
    },
    '.cm-cursor': {
      borderLeftColor: '#9c27b0'
    },
    '.cm-selectionBackground': {
      backgroundColor: '#ce93d8'
    }
  }, { dark: false })
}

// Custom syntax highlighting for each theme
export const customHighlighting = {
  ocean: syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: '#2980b9' },
      { tag: t.comment, color: '#7f8c8d', fontStyle: 'italic' },
      { tag: t.string, color: '#27ae60' },
      { tag: t.number, color: '#e74c3c' },
      { tag: t.meta, color: '#8e44ad' },
      { tag: t.atom, color: '#f39c12' },
      { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#16a085' }
    ])
  ),

  forest: syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: '#2e7d32' },
      { tag: t.comment, color: '#81c784', fontStyle: 'italic' },
      { tag: t.string, color: '#1b5e20' },
      { tag: t.number, color: '#e65100' },
      { tag: t.meta, color: '#4a148c' },
      { tag: t.atom, color: '#e65100' },
      { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#006064' }
    ])
  ),

  sunset: syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: '#e65100' },
      { tag: t.comment, color: '#8d6e63', fontStyle: 'italic' },
      { tag: t.string, color: '#bf360c' },
      { tag: t.number, color: '#4e342e' },
      { tag: t.meta, color: '#6a1b9a' },
      { tag: t.atom, color: '#ff6f00' },
      { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#d84315' }
    ])
  ),

  purple: syntaxHighlighting(
    HighlightStyle.define([
      { tag: t.keyword, color: '#6a1b9a' },
      { tag: t.comment, color: '#9575cd', fontStyle: 'italic' },
      { tag: t.string, color: '#4a148c' },
      { tag: t.number, color: '#e91e63' },
      { tag: t.meta, color: '#673ab7' },
      { tag: t.atom, color: '#7b1fa2' },
      { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#512da8' }
    ])
  )
}

// Create theme extension combinations
export const createCustomTheme = (themeName: keyof typeof customThemes): Extension[] => {
  return [
    customThemes[themeName],
    customHighlighting[themeName]
  ]
} 