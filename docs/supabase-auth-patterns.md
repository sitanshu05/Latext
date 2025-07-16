# Supabase Auth Schema Patterns

## Auth Schema Structure

Supabase manages users in the `auth` schema:
- `auth.users` - Core user data (id, email, etc.)
- `auth.identities` - OAuth provider data
- `auth.sessions` - User sessions

Your app tables live in the `public` schema and reference `auth.users`.

## Proper Foreign Key References

### ✅ Correct Way (Current Setup)
```sql
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT ''
);
```

### ❌ Wrong Way
```sql
-- DON'T do this - auth.users is not in public schema
user_id UUID REFERENCES public.users(id) 

-- DON'T create your own users table
CREATE TABLE public.users (...) -- Supabase handles this
```

## Row Level Security (RLS) Patterns

### Using auth.uid() in Policies
```sql
-- Allow users to see only their own projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create projects for themselves
CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Optional: Public User Profiles

If you need additional user data beyond what auth.users provides:

```sql
-- Create a public profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);
```

## TypeScript Types

When working with auth users in TypeScript:

```typescript
// auth.users has these core fields:
interface AuthUser {
  id: string;           // UUID
  email?: string;
  email_confirmed_at?: string;
  created_at: string;
  updated_at: string;
  // ... other auth fields
}

// Your project type references the user
interface Project {
  id: string;
  user_id: string;      // References auth.users.id
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
```

## Client-Side Usage

```typescript
// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Create project for current user
const { data, error } = await supabase
  .from('projects')
  .insert({
    user_id: user.id,  // Use auth user's ID
    title: 'My Project',
    content: 'LaTeX content here'
  });

// Query user's projects
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', user.id);  // Filter by current user
```

## Key Points

1. **Never create your own users table** - Supabase Auth handles this
2. **Always reference `auth.users(id)`** when creating foreign keys
3. **Use `auth.uid()`** in RLS policies to get current user
4. **Create profile tables** only if you need extra user data
5. **RLS policies automatically filter** by user when using auth.uid()

Your current setup is already following these best practices! 🎉 