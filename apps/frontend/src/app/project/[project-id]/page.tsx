'use client'

import { useState, useEffect, use } from 'react'
import { getProjectById, type ProjectWithFiles } from '@/lib/services/projects'
import EditorComponent from '@/components/editor/EditorComponent'

export default function ProjectPage({ params }: { params: Promise<{ 'project-id': string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams['project-id']

  const [project, setProject] = useState<ProjectWithFiles | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentFileContent, setCurrentFileContent] = useState<string>('')
  const [currentFileName, setCurrentFileName] = useState<string>('')

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const { project: data, error } = await getProjectById(projectId)
      if (data) {
        setProject(data)
        // Set the first file as the current file for editing
        if (data.files && data.files.length > 0) {
          const firstFile = data.files[0]
          setCurrentFileContent(firstFile.content)
          setCurrentFileName(firstFile.name)
        }
      }
      if (error) {
        console.error('Error fetching project:', error)
      }
      setLoading(false)
    }
    fetchProject()
  }, [projectId])

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentFileContent(value)
    }
  }

  const handleSave = () => {
    // TODO: Implement file saving (Task 6.5)
    console.log('Save triggered for file:', currentFileName)
    console.log('Content:', currentFileContent)
    alert('Save functionality will be implemented in Task 6.5!')
  }

  const handleFind = () => {
    // Monaco Editor will handle find internally
    console.log('Find triggered')
  }

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <div>Loading...</div>
      ) : project ? (
        <div>
          <h1>{project.name}</h1>
          <div style={{ marginBottom: '20px' }}>
            <small>Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}</small>
          </div>

          {/* Monaco Editor Section */}
          {currentFileName && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderBottom: 'none',
                borderRadius: '5px 5px 0 0'
              }}>
                <div>
                  <strong>Editing: {currentFileName}</strong> ({project.files?.find(f => f.name === currentFileName)?.file_type})
                </div>
                <div>
                  <button 
                    onClick={handleSave}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: '#007acc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save (Ctrl+S)
                  </button>
                </div>
              </div>
              
              <div style={{ border: '1px solid #ccc', borderRadius: '0 0 5px 5px' }}>
                <EditorComponent
                  value={currentFileContent}
                  language="latex"
                  theme="vs-light"
                  height="500px"
                  config={{
                    fontSize: 14,
                    fontFamily: 'Monaco, "Lucida Console", Courier, monospace',
                    tabSize: 2,
                    minimap: false,
                    lineNumbers: 'on',
                    wordWrap: 'on'
                  }}
                  onChange={handleContentChange}
                  onSave={handleSave}
                  onFind={handleFind}
                />
              </div>
            </div>
          )}
          
          {/* File List (for reference/debugging) */}
          {project.files && project.files.length > 0 && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
                All Files ({project.files.length})
              </summary>
              <div>
                {project.files.map((file) => (
                  <div key={file.id} style={{ 
                    marginBottom: '10px', 
                    padding: '10px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '3px',
                    backgroundColor: file.name === currentFileName ? '#e3f2fd' : '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {file.name} ({file.file_type})
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {file.content.length} characters
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {!currentFileName && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No files found for this project.
            </div>
          )}
        </div>
      ) : (
        <div>Project not found.</div>
      )}
    </div>
  )
}