CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own projects (for all operations)
CREATE POLICY "Enable full access for users based on user_id"
ON projects
AS PERMISSIVE
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (true);

