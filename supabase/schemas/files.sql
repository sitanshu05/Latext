CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable full access to files if user owns the project"
ON public.files
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = files.project_id
    AND projects.user_id = auth.uid()
  )
);