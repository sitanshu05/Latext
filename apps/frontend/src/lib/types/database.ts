import { Tables, TablesInsert, TablesUpdate } from './supabase'

// Table row types
export type Project = Tables<'projects'>
export type File = Tables<'files'>

// Insert types (for creating new records)
export type ProjectInsert = TablesInsert<'projects'>
export type FileInsert = TablesInsert<'files'>

// Update types (for updating existing records)
export type ProjectUpdate = TablesUpdate<'projects'>
export type FileUpdate = TablesUpdate<'files'>