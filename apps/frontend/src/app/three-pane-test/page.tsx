'use client'

import React, { useState } from 'react'
import { ThreePaneLayout } from '@/components/editor/ThreePaneLayout'
import { type FileMetadata } from '@/components/editor/FileEditor'

export default function ThreePaneTestPage() {
  const [files, setFiles] = useState<FileMetadata[]>([
    {
      id: '1',
      name: 'main.tex',
      file_type: 'tex',
      size: 800,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}
\\usepackage{graphicx}

\\title{JIKO (JURNAL INFORMATIKA DAN KOMPUTER)}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

This is the main document for the JIKO journal.

\\section{Mathematics}

Here's some math: $E = mc^2$

\\begin{equation}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
\\end{equation}

\\section{Tables}

\\begin{table}[h]
\\centering
\\begin{tabular}{|c|c|c|}
\\hline
Header 1 & Header 2 & Header 3 \\\\
\\hline
Data 1 & Data 2 & Data 3 \\\\
\\hline
\\end{tabular}
\\caption{Sample Table}
\\end{table}

\\section{Code Listing}

\\begin{lstlisting}[language=Python]
def hello_world():
    print("Hello, World!")
    return True
\\end{lstlisting}

\\end{document}`
    },
    {
      id: '2',
      name: 'chapter1.tex',
      file_type: 'tex',
      size: 400,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: `\\chapter{First Chapter}

This is the first chapter of our document.

\\section{Background}

Some background information here.

\\subsection{Details}

More detailed information in this subsection.

\\begin{itemize}
\\item First item
\\item Second item
\\item Third item
\\end{itemize}`
    },
    {
      id: '3',
      name: 'references.bib',
      file_type: 'bib',
      size: 300,
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
}

@inproceedings{conference2021,
  title={Conference Paper Example},
  author={Researcher, R.},
  booktitle={Proceedings of the Example Conference},
  year={2021},
  pages={100--110}
}`
    },
    {
      id: '4',
      name: 'jiko-logo.pdf',
      file_type: 'pdf',
      size: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: 'PDF file content (binary)'
    },
    {
      id: '5',
      name: '3a.png',
      file_type: 'png',
      size: 200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content: 'Image file content (binary)'
    }
  ])

  const handleFilesChange = (newFiles: FileMetadata[]) => {
    setFiles(newFiles)
  }

  return (
    <div className="h-screen">
      {/* Three-Pane Layout */}
      <div className="h-full">
        <ThreePaneLayout
          projectId="test-project"
          files={files}
          onFilesChange={handleFilesChange}
          className="h-full"
        />
      </div>
    </div>
  )
} 