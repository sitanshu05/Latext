'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, type AuthUser, logout } from '@/lib/services/auth'
import { useRouter } from 'next/navigation'
import { getProjects, createProject } from '@/lib/services/projects'
import { Project } from '@/lib/types/database'
import Link from 'next/link'

export default function ProjectPage() {

  const [user, setUser] = useState<AuthUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { user, error } = await getCurrentUser()
      if (user && !error) {
        setUser(user)
      } else if (error) {
        const { error: logoutError } = await logout()
        if (logoutError) {
          console.error('Error logging out:', logoutError)
        }
        router.push('/')
      } else {
        router.push('/')
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return
      
      const { projects: data, error } = await getProjects()

      if (data) {
        setProjects(data)
      }
      if (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [user])

  const handleCreateProject = async () => {
    setIsCreating(true)
    const projectName = prompt('Enter project name:')
    
    if (projectName) {
      const { project, error } = await createProject({ name: projectName })
      
      if (project) {
        // Refresh the projects list
        const { projects: updatedProjects } = await getProjects()
        if (updatedProjects) {
          setProjects(updatedProjects)
        }
        // Navigate to the new project
        router.push(`/project/${project.id}`)
      } else if (error) {
        alert(`Error creating project: ${error}`)
      }
    }
    setIsCreating(false)
  }

  return (
    <div>
      <h1>Projects</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleCreateProject}
          disabled={isCreating}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isCreating ? 'not-allowed' : 'pointer'
          }}
        >
          {isCreating ? 'Creating...' : 'Create New Project'}
        </button>
      </div>
      <div>
        {projects.length === 0 ? (
          <p>No projects yet. Create your first project!</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <Link href={`/project/${project.id}`} style={{ textDecoration: 'none', color: '#0070f3' }}>
                <h3>{project.name}</h3>
                <small>Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown'}</small>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}