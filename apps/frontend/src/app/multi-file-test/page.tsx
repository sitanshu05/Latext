'use client'

import React, { useState } from 'react'
import { MultiFileEditor } from '@/components/editor/MultiFileEditor'
import { type FileMetadata } from '@/components/editor/FileEditor'

export default function MultiFileTestPage() {
  const [files, setFiles] = useState<FileMetadata[]>([
    {
      id: '1',
      name: 'main.tex',
      file_type: 'tex',
      size: 500,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Main Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

This is the main document.

\\section{Mathematics}

Here's some math: $E = mc^2$

\\end{document}`
    },
    {
      id: '2',
      name: 'chapter1.tex',
      file_type: 'tex',
      size: 300,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: `\\chapter{First Chapter}

This is the first chapter of our document.

\\section{Background}

Some background information here.

\\subsection{Details}

More detailed information in this subsection.`
    },
    {
      id: '3',
      name: 'references.bib',
      file_type: 'bib',
      size: 200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: `@article{example2023,
  title={An Example Article},
  author={Smith, John and Doe, Jane},
  journal={Journal of Examples},
  year={2023},
  volume={1},
  number={1},
  pages={1--10}
}

@book{textbook2022,
  title={A Textbook Example},
  author={Author, A.},
  publisher={Example Publisher},
  year={2022}
}`
    }
  ])

  const handleFilesChange = (newFiles: FileMetadata[]) => {
    setFiles(newFiles)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Multi-File Editor Test</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Test the multi-file editing functionality with tabs, file switching, and operations
        </p>
      </div>

      {/* Multi-File Editor */}
      <div className="flex-1">
        <MultiFileEditor
          projectId="test-project"
          files={files}
          onFilesChange={handleFilesChange}
          className="h-full"
        />
      </div>
    </div>
  )
} 