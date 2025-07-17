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

export const createFile = async (projectId: string, fileName: string, fileType: string = 'tex'): Promise<{ file: File | null; error: string | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { file: null, error: 'User not authenticated' }
    }

    // Check if user owns the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return { file: null, error: 'Project not found or access denied' }
    }

    // Create default content based on file type
    let defaultContent = ''
    if (fileType === 'tex') {
      defaultContent = `% ${fileName}\n\n`
    } else if (fileType === 'bib') {
      defaultContent = `% Bibliography file: ${fileName}\n\n`
    }

    const fileData: FileInsert = {
      project_id: projectId,
      name: fileName,
      path: `/${fileName}`,
      content: defaultContent,
      storage_path: `${projectId}/${fileName}`,
      file_type: fileType,
      mime_type: fileType === 'tex' ? 'text/plain' : 'text/plain'
    }

    const { data: newFile, error: fileError } = await supabase
      .from('files')
      .insert(fileData)
      .select()
      .single()

    if (fileError) {
      return { file: null, error: fileError.message }
    }

    return { file: newFile, error: null }
  } catch (err) {
    return { file: null, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const renameFile = async (fileId: string, newName: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if user owns the file (via project)
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select(`
        id,
        project_id,
        projects!inner(user_id)
      `)
      .eq('id', fileId)
      .eq('projects.user_id', user.id)
      .single()

    if (fileError || !file) {
      return { success: false, error: 'File not found or access denied' }
    }

    // Update file name
    const { error: updateError } = await supabase
      .from('files')
      .update({
        name: newName,
        path: `/${newName}`,
        storage_path: `${file.project_id}/${newName}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', fileId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}

export const deleteFile = async (fileId: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if user owns the file (via project)
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select(`
        id,
        projects!inner(user_id)
      `)
      .eq('id', fileId)
      .eq('projects.user_id', user.id)
      .single()

    if (fileError || !file) {
      return { success: false, error: 'File not found or access denied' }
    }

    // Delete file
    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
} 