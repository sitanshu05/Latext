'use client'

import { useState, useEffect, use } from 'react'
import { getProjectById, type ProjectWithFiles } from '@/lib/services/projects'
import { ThreePaneLayout } from '@/components/editor/ThreePaneLayout'
import { type FileMetadata } from '@/components/editor/FileEditor'

export default function ProjectPage({ params }: { params: Promise<{ 'project-id': string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams['project-id']

  const [project, setProject] = useState<ProjectWithFiles | null>(null)
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<FileMetadata[]>([])

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const { project: data, error } = await getProjectById(projectId)
      if (data) {
        setProject(data)
        // Convert project files to FileMetadata format
        if (data.files && data.files.length > 0) {
          const fileMetadata: FileMetadata[] = data.files.map(file => ({
            id: file.id,
            name: file.name,
            file_type: file.file_type,
            size: file.content.length,
            created_at: file.created_at,
            updated_at: file.updated_at,
            content: file.content
          }))
          setFiles(fileMetadata)
        }
      }
      if (error) {
        console.error('Error fetching project:', error)
      }
      setLoading(false)
    }
    fetchProject()
  }, [projectId])

  const handleFilesChange = (newFiles: FileMetadata[]) => {
    setFiles(newFiles)
  }

  return (
    <div className="h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading project...</div>
        </div>
      ) : project ? (
        <>
          {/* Three-Pane Layout */}
          <div className="h-full">
            {files.length > 0 ? (
              <ThreePaneLayout
                projectId={projectId}
                files={files}
                onFilesChange={handleFilesChange}
                className="h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No files found for this project.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-red-600">Project not found.</div>
        </div>
      )}
    </div>
  )
}