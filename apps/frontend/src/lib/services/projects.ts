import { supabase } from './supabase'
import { ProjectInsert, Project, FileInsert, File } from '@/lib/types/database'

// Default main.tex template content
const DEFAULT_MAIN_TEX_CONTENT = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amsfonts}
\\usepackage{amssymb}

\\title{Your Title Here}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Write your content here.

\\end{document}
`

export interface ProjectWithFiles extends Project {
  files?: File[]
}

export const createProject = async (data: Pick<ProjectInsert, 'name'> & { description?: string }): Promise<{ project: Project | null; error: string | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { project: null, error: 'User not authenticated' }
    }

    // Create the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        description: data.description,
        user_id: user.id
      })
      .select()
      .single()

    if (projectError) {
      return { project: null, error: projectError.message }
    }

    // Create the default main.tex file
    const fileData: FileInsert = {
      project_id: projectData.id,
      name: 'main.tex',
      path: '/main.tex',
      content: DEFAULT_MAIN_TEX_CONTENT,
      storage_path: `${projectData.id}/main.tex`,
      file_type: 'tex',
      mime_type: 'text/plain'
    }
    
    const { error: fileError } = await supabase
      .from('files')
      .insert(fileData)

    if (fileError) {
      // If file creation fails, we should clean up the project
      await supabase.from('projects').delete().eq('id', projectData.id)
      return { project: null, error: `Failed to create default file: ${fileError.message}` }
    }

    return { project: projectData, error: null }
  } catch (err) {
    return { project: null, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const getProjects = async (): Promise<{ projects: Project[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      return { projects: null, error: error.message }
    }

    return { projects: data, error: null }
  } catch (err) {
    return { projects: null, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const getProjectById = async (id: string): Promise<{ project: ProjectWithFiles | null; error: string | null }> => {
  try {
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError) {
      return { project: null, error: projectError.message }
    }

    // Get project files
    const { data: filesData, error: filesError } = await supabase
      .from('files')
      .select('id, name, content, file_type')
      .eq('project_id', id)

    if (filesError) {
      return { project: null, error: filesError.message }
    }

    const projectWithFiles: ProjectWithFiles = {
      ...projectData,
      files: filesData
    }

    return { project: projectWithFiles, error: null }
  } catch (err) {
    return { project: null, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const updateProject = async (id: string, data: Partial<Pick<ProjectInsert, 'name'> & { description?: string }>): Promise<{ project: Project | null; error: string | null }> => {
  try {
    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { project: null, error: error.message }
    }

    return { project: updatedProject, error: null }
  } catch (err) {
    return { project: null, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const deleteProject = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const updateFileContent = async (fileId: string, content: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from('files')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
} 