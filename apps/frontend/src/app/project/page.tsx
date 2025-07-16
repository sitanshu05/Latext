'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, type AuthUser, logout } from '@/lib/services/auth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/services/supabase'
import { Project } from '@/lib/types/database'
import Link from 'next/link'

export default function ProjectPage() {

  const [user, setUser] = useState<AuthUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
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
      
      // RLS automatically filters projects by user_id, no need for .eq('user_id', user.id)
      const { data, error } = await supabase.from('projects').select("*");

      if (data) {
        setProjects(data)
      }
      if (error) {
        console.error('Error fetching projects:', error)
      }
    }
    fetchProjects()
  }, [user])

  return (
    <div>
      <h1>Project</h1>
      <div>
        {projects.map((project) => (
          <div key={project.id}>
            <Link href={`/project/${project.id}`}>{project.name}</Link>
          </div>
        ))}
      </div>
    </div>
  )
}