# Linking Local Supabase to Remote

## Step 1: Login to Supabase
```bash
npx supabase login
```
This will open a browser window for you to authenticate with your Supabase account.

## Step 2: Check Your Remote Projects
```bash
npx supabase projects list
```
This shows all your remote Supabase projects.

## Step 3A: If You Have a Remote Project
If you already have a remote project you want to link to:
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

## Step 3B: If You Need to Create a Remote Project
If you don't have a remote project yet:
```bash
npx supabase projects create "latext-production"
```
Then link to it:
```bash
npx supabase link --project-ref YOUR_NEW_PROJECT_REF
```

## Step 4: Sync Your Local Schema to Remote

### Option A: Push Local Migrations to Remote (Recommended)
If your local database has the schema you want:
```bash
# Push your local migrations to remote
npx supabase db push

# This will:
# - Apply your local migrations to the remote database
# - Create the projects table with proper auth references
# - Set up RLS policies
```

### Option B: Pull Remote Schema to Local
If your remote has the schema you want:
```bash
# Pull remote schema to local
npx supabase db pull

# This will create new migration files based on your remote schema
```

## Step 5: Generate TypeScript Types
After syncing, update your TypeScript types:
```bash
npx supabase gen types typescript --local > ../supabase/types.ts
```

## Step 6: Update Environment Variables
Make sure your frontend is pointing to the correct Supabase instance:

### For Local Development (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Production (.env.production):
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## Workflow Best Practices

### Development Workflow:
1. Develop locally with `supabase start`
2. Create migrations for schema changes
3. Test locally
4. Push to remote with `supabase db push`

### Schema Changes:
```bash
# Create a new migration
npx supabase migration new add_new_feature

# Edit the migration file in supabase/migrations/
# Then push to remote
npx supabase db push
```

### Data Migration:
```bash
# If you need to migrate data, create seed files
# supabase/seeds/your_data.sql

# Apply seeds to remote
npx supabase db push --include-seed
```

## Troubleshooting

### Common Issues:
1. **Schema Conflicts**: If remote and local differ, you might need to resolve conflicts manually
2. **RLS Policies**: Make sure your auth.uid() policies work in both environments
3. **Environment Variables**: Double-check your Supabase URLs and keys

### Reset and Resync:
```bash
# If things get messy, you can reset local and pull from remote
npx supabase db reset
npx supabase db pull
```

## Verify Connection
After linking, verify everything works:
```bash
# Check status
npx supabase status

# Test connection to remote
npx supabase projects api-keys --project-ref YOUR_PROJECT_REF
``` 