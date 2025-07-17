import { LanguageSupport, StreamLanguage } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// LaTeX language definition using stream parser
const latexLanguageDefinition = StreamLanguage.define({
  name: 'latex',
  startState: () => ({
    inMath: false,
    inComment: false,
    commandDepth: 0
  }),
  
  token(stream, state) {
    // Comments
    if (stream.match(/^%.*$/)) {
      return 'comment'
    }
    
    // Math mode (inline)
    if (stream.match(/^\$[^$]*\$/)) {
      return 'string-2'
    }
    
    // Math mode (display)
    if (stream.match(/^\$\$[^$]*\$\$/)) {
      return 'string-2'
    }
    
    // Commands starting with backslash
    if (stream.match(/^\\[a-zA-Z]+\*?/)) {
      return 'keyword'
    }
    
    // Environment begin/end
    if (stream.match(/^\\(begin|end)\{[^}]+\}/)) {
      return 'atom'
    }
    
    // Braces for arguments
    if (stream.match(/^\{[^}]*\}/)) {
      return 'string'
    }
    
    // Square brackets for optional arguments
    if (stream.match(/^\[[^\]]*\]/)) {
      return 'meta'
    }
    
    // Numbers
    if (stream.match(/^\d+(\.\d+)?/)) {
      return 'number'
    }
    
    // Single character
    stream.next()
    return null
  },
  
  languageData: {
    commentTokens: { line: '%' },
    indentOnInput: /^\s*\\(begin|end)\{/,
    wordChars: '$\\',
  }
})

// LaTeX autocompletion items
const latexCompletions = [
  // Document structure
  { label: '\\documentclass', type: 'keyword', detail: 'Document class declaration' },
  { label: '\\usepackage', type: 'keyword', detail: 'Package import' },
  { label: '\\begin{document}', type: 'keyword', detail: 'Begin document environment' },
  { label: '\\end{document}', type: 'keyword', detail: 'End document environment' },
  { label: '\\title', type: 'keyword', detail: 'Document title' },
  { label: '\\author', type: 'keyword', detail: 'Document author' },
  { label: '\\date', type: 'keyword', detail: 'Document date' },
  { label: '\\maketitle', type: 'keyword', detail: 'Generate title' },
  
  // Sectioning
  { label: '\\section', type: 'keyword', detail: 'Section heading' },
  { label: '\\subsection', type: 'keyword', detail: 'Subsection heading' },
  { label: '\\subsubsection', type: 'keyword', detail: 'Subsubsection heading' },
  { label: '\\chapter', type: 'keyword', detail: 'Chapter heading' },
  { label: '\\part', type: 'keyword', detail: 'Part heading' },
  
  // Text formatting
  { label: '\\textbf', type: 'function', detail: 'Bold text' },
  { label: '\\textit', type: 'function', detail: 'Italic text' },
  { label: '\\texttt', type: 'function', detail: 'Typewriter text' },
  { label: '\\emph', type: 'function', detail: 'Emphasized text' },
  { label: '\\underline', type: 'function', detail: 'Underlined text' },
  
  // Environments
  { label: '\\begin{itemize}', type: 'keyword', detail: 'Unordered list' },
  { label: '\\begin{enumerate}', type: 'keyword', detail: 'Ordered list' },
  { label: '\\begin{figure}', type: 'keyword', detail: 'Figure environment' },
  { label: '\\begin{table}', type: 'keyword', detail: 'Table environment' },
  { label: '\\begin{equation}', type: 'keyword', detail: 'Equation environment' },
  { label: '\\begin{align}', type: 'keyword', detail: 'Aligned equations' },
  { label: '\\begin{center}', type: 'keyword', detail: 'Centered content' },
  
  // Lists
  { label: '\\item', type: 'keyword', detail: 'List item' },
  
  // Math
  { label: '\\frac', type: 'function', detail: 'Fraction' },
  { label: '\\sqrt', type: 'function', detail: 'Square root' },
  { label: '\\sum', type: 'function', detail: 'Summation' },
  { label: '\\int', type: 'function', detail: 'Integration' },
  { label: '\\alpha', type: 'variable', detail: 'Greek letter alpha' },
  { label: '\\beta', type: 'variable', detail: 'Greek letter beta' },
  { label: '\\gamma', type: 'variable', detail: 'Greek letter gamma' },
  { label: '\\delta', type: 'variable', detail: 'Greek letter delta' },
  { label: '\\epsilon', type: 'variable', detail: 'Greek letter epsilon' },
  { label: '\\theta', type: 'variable', detail: 'Greek letter theta' },
  { label: '\\lambda', type: 'variable', detail: 'Greek letter lambda' },
  { label: '\\pi', type: 'variable', detail: 'Greek letter pi' },
  { label: '\\sigma', type: 'variable', detail: 'Greek letter sigma' },
  { label: '\\phi', type: 'variable', detail: 'Greek letter phi' },
  
  // References
  { label: '\\label', type: 'function', detail: 'Label for cross-reference' },
  { label: '\\ref', type: 'function', detail: 'Reference to label' },
  { label: '\\cite', type: 'function', detail: 'Citation' },
  { label: '\\bibliography', type: 'keyword', detail: 'Bibliography' },
  
  // Graphics
  { label: '\\includegraphics', type: 'function', detail: 'Include image' },
  { label: '\\caption', type: 'function', detail: 'Caption for figure/table' },
  
  // Spacing
  { label: '\\vspace', type: 'function', detail: 'Vertical space' },
  { label: '\\hspace', type: 'function', detail: 'Horizontal space' },
  { label: '\\newline', type: 'keyword', detail: 'Line break' },
  { label: '\\newpage', type: 'keyword', detail: 'Page break' },
]

// LaTeX language support with autocompletion
export const latexLanguage = new LanguageSupport(latexLanguageDefinition, [
  latexLanguageDefinition.data.of({
    autocomplete: (context: any) => {
      // Only trigger autocompletion when typing backslash
      const word = context.matchBefore(/\\\w*/)
      if (!word || !word.text.startsWith('\\')) return null
      
      const options = latexCompletions.map(comp => ({
        label: comp.label,
        type: comp.type,
        detail: comp.detail,
        apply: comp.label,
      }))
      
      return {
        from: word.from,
        options: options.filter(option => 
          option.label.toLowerCase().includes(word.text.toLowerCase())
        )
      }
    }
  })
])

export default latexLanguage 