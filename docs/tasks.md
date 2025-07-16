# Projects Page Implementation Tasks - Fresh Start ✨

## Fresh Setup Status ✅
- ✅ Local Supabase running on http://127.0.0.1:54321
- ✅ Frontend configured with local credentials 
- ✅ No migrations (clean slate)
- ✅ No remote connections
- ✅ Docker volumes cleared

## Next Steps - Build from Scratch

### 1. Create Projects Table Migration
- [ ] Create new migration: `npx supabase migration new create_projects_table`
- [ ] Define projects schema with user relationship
- [ ] Add RLS policies for user isolation
- [ ] Apply migration locally

### 2. Projects Service Layer
- [ ] Create `src/lib/services/projects.ts`
- [ ] Implement CRUD operations (create, read, update, delete)
- [ ] Add TypeScript interfaces for Project type
- [ ] Handle error cases and validation

### 3. Projects List Page
- [ ] Create `/src/app/projects/page.tsx`
- [ ] Add authentication check and redirect
- [ ] Implement projects grid/list view
- [ ] Add search and filter functionality
- [ ] Add "New Project" button

### 4. Project Card Component
- [ ] Create `ProjectCard.tsx` component
- [ ] Display project title, last modified, created date
- [ ] Add preview of content (first few lines)
- [ ] Include action buttons (edit, delete, duplicate)

### 5. New/Edit Project Modal
- [ ] Create `CreateProjectModal.tsx` component
- [ ] Add form validation for project title
- [ ] Handle project creation with user_id
- [ ] Add loading states and error handling

### 6. Project Editor Page
- [ ] Create `/src/app/projects/[id]/page.tsx`
- [ ] Load project data by ID
- [ ] Integrate with Monaco Editor (if not already done)
- [ ] Auto-save functionality
- [ ] Real-time preview integration

### 7. Navigation Updates
- [ ] Add "Projects" link to main navigation
- [ ] Update layout to include projects navigation
- [ ] Add breadcrumbs for project editor

### 8. UI Components
- [ ] Empty state component for no projects
- [ ] Loading skeletons for project cards
- [ ] Confirmation dialogs for delete actions
- [ ] Toast notifications for actions

### 9. Testing & Polish
- [ ] Test project CRUD operations
- [ ] Test authentication flows
- [ ] Responsive design verification
- [ ] Error handling edge cases

---

## Schema Design for Projects Table

```sql
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '', -- LaTeX content
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);
```

## File Storage Strategy

**Phase 1**: Store LaTeX content in `content` field
**Future**: Add file attachments via Supabase Storage for images, references, etc.
