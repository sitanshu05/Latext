'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/lib/services/supabase'
import { Project } from '@/lib/types/database'

export default function ProjectPage({ params }: { params: Promise<{ 'project-id': string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams['project-id']

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('projects').select('*').eq('id', projectId)
      if (data) {
        setProject(data[0])
      }
      if (error) {
        console.error('Error fetching project:', error)
      }
      setLoading(false)
    }
    fetchProject()
  }, [projectId])

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Project {projectId}</h1>
          <div>
            <h2>{project?.name}</h2>
          </div>
        </div>
      )}
    </div>
  )
}