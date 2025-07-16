# Database Sync Steps

## Current Status ✅
- Local Supabase: Running
- Remote Project: Linked (typkfnmfamaotmjuvcik)
- Issue: Need database password for schema push

## Next Steps

### 1. Get Database Password
Visit: https://supabase.com/dashboard/project/typkfnmfamaotmjuvcik/settings/database
- Either copy existing password
- Or reset database password if forgotten

### 2. Push Schema to Remote
```bash
npx supabase db push
# Enter the database password when prompted
```

### 3. Update TypeScript Types
```bash
npx supabase gen types typescript --linked > supabase/types.ts
```

### 4. Verify Schema
Check your remote database has the projects table:
- Go to: https://supabase.com/dashboard/project/typkfnmfamaotmjuvcik/editor
- Should see `public.projects` table

## Alternative: Manual Schema Creation

If push continues failing, you can manually create the schema:

1. Go to SQL Editor: https://supabase.com/dashboard/project/typkfnmfamaotmjuvcik/sql/new
2. Copy and paste the migration content:

```sql
-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);
```

3. Click "Run"

## Troubleshooting

If you still get SASL auth errors:
- Double-check you're using the database password, not account password
- Try resetting the database password
- Ensure you're copying the password correctly (no extra spaces) 