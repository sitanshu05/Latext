'use client'

import { useState, useEffect, use } from 'react'
import { getProjectById, type ProjectWithFiles } from '@/lib/services/projects'
import { FileEditor, type FileMetadata } from '@/components/editor/FileEditor'

export default function ProjectPage({ params }: { params: Promise<{ 'project-id': string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams['project-id']

  const [project, setProject] = useState<ProjectWithFiles | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentFile, setCurrentFile] = useState<FileMetadata | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const { project: data, error } = await getProjectById(projectId)
      if (data) {
        setProject(data)
        // Set the first file as the current file for editing
        if (data.files && data.files.length > 0) {
          const firstFile = data.files[0]
          setCurrentFile({
            id: firstFile.id,
            name: firstFile.name,
            file_type: firstFile.file_type,
            size: firstFile.content.length,
            created_at: firstFile.created_at,
            updated_at: firstFile.updated_at,
            content: firstFile.content
          })
        }
      }
      if (error) {
        console.error('Error fetching project:', error)
      }
      setLoading(false)
    }
    fetchProject()
  }, [projectId])

  const handleContentChange = (content: string) => {
    if (currentFile) {
      setCurrentFile({
        ...currentFile,
        content,
        updated_at: new Date().toISOString()
      })
    }
  }

  const handleSave = async (content: string) => {
    // TODO: Implement file saving (Task 6.5)
    console.log('Save triggered for file:', currentFile?.name)
    console.log('Content:', content)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update current file with new content
    if (currentFile) {
      setCurrentFile({
        ...currentFile,
        content,
        updated_at: new Date().toISOString()
      })
    }
    
    console.log('File saved successfully!')
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

          {/* Enhanced File Editor */}
          {currentFile && (
            <div style={{ marginBottom: '20px' }}>
              <FileEditor
                file={currentFile}
                onSave={handleSave}
                onContentChange={handleContentChange}
                loading={loading}
                className="enhanced-file-editor"
              />
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
                    backgroundColor: file.id === currentFile?.id ? '#e3f2fd' : '#f9f9f9'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                      {file.name} ({file.file_type})
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      {file.content.length} characters
                      {file.updated_at && (
                        <span> • Modified: {new Date(file.updated_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}

          {!currentFile && (
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