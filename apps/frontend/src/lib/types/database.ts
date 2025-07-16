import { Tables, TablesInsert, TablesUpdate } from './supabase'

// Table row types
export type Project = Tables<'projects'>

// Insert types (for creating new records)
export type ProjectInsert = TablesInsert<'projects'>

// Update types (for updating existing records)
export type ProjectUpdate = TablesUpdate<'projects'> 