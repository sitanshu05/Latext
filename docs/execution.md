# 🚀 LaTeX Project Execution Plan

## 📋 Current Status: v0.2 Editor Complete ✅

---

## 🛠️ Phase 1: Setup & Scaffolding ✅ **COMPLETED**

### 🔹 Stage 1.1 – Init Monorepo ✅
- ✅ `pnpm init`
- ✅ `pnpm install -w`
- ✅ Set up `pnpm-workspace.yaml`
- ✅ Create `apps/`, `supabase/`, folder structure

### 🔹 Stage 1.2 – Supabase Init ✅
- ✅ `supabase init`
- ✅ Create `projects` table with user relationships
- ✅ Create `files` table for file management
- ✅ Add RLS policies: `auth.uid() = user_id`
- ✅ Applied migrations locally

---

## 🎨 Phase 2: Core Foundation ✅ **COMPLETED**

### 🔹 Stage 2.1 – Auth ✅
- ✅ Set up Supabase client
- ✅ Login / Signup pages
- ✅ Authentication service layer
- ✅ Route protection

### 🔹 Stage 2.2 – Project Management ✅
- ✅ Projects service layer with full CRUD
- ✅ TypeScript type system integration
- ✅ Project creation with automatic main.tex file
- ✅ File management system
- ✅ Basic UI for project listing and creation

---

## 🎯 Phase 3: Editor Interface ✅ **COMPLETED**

### 🔹 Stage 3.1 – CodeMirror Editor Integration ✅
- ✅ Install and configure CodeMirror packages
- ✅ LaTeX syntax highlighting with custom language definition
- ✅ File editing interface for main.tex with status bar
- ✅ Auto-save functionality with 900ms debounce
- ✅ Error highlighting and status indicators

### 🔹 Stage 3.2 – File Management UI 🚧 **CURRENT FOCUS**
- [ ] File explorer component with file tree
- [ ] Create/rename/delete files
- [ ] File tabs for multiple files
- [ ] File content persistence across switches

### 🔹 Stage 3.3 – Basic Preview
- [ ] KaTeX or MathJax for math rendering
- [ ] Split-pane layout (editor + preview)
- [ ] Real-time content updates
- [ ] Toggle preview on/off

---

## 📄 Phase 4: PDF Compilation 🔮 **PLANNED**

### 🔹 Stage 4.1 – Backend Setup
- [ ] FastAPI backend service
- [ ] Tectonic LaTeX in Docker setup
- [ ] `/compile` endpoint implementation
- [ ] File handling for compilation

### 🔹 Stage 4.2 – Frontend Integration
- [ ] Compile button in UI
- [ ] PDF preview component
- [ ] Download functionality
- [ ] Compilation status feedback

---

## 🧠 Phase 5: AI Features 🔮 **PLANNED**

### 🔹 Stage 5.1 – AI Service Integration
- [ ] OpenAI/Gemini API setup
- [ ] Text rewriting service
- [ ] Math equation generation
- [ ] Citation generation

### 🔹 Stage 5.2 – UI Integration
- [ ] AI assistant sidebar
- [ ] Text selection for rewriting
- [ ] Inline suggestions
- [ ] AI-powered autocomplete

---

## 🌐 Phase 6: Polish & Features 🔮 **FUTURE**

### 🔹 Stage 6.1 – Advanced Features
- [ ] Multiple file projects
- [ ] Template system
- [ ] Citation manager
- [ ] Export options (multiple formats)

### 🔹 Stage 6.2 – Collaboration
- [ ] Real-time editing (Y.js)
- [ ] Share projects
- [ ] Version history
- [ ] Comments system

---

## 🚀 Phase 7: Deployment & Launch 🔮 **FUTURE**

### 🔹 Stage 7.1 – Production Setup
- [ ] Vercel deployment (frontend)
- [ ] Backend hosting (Render/Fly.io)
- [ ] Environment configuration
- [ ] CI/CD pipeline

### 🔹 Stage 7.2 – Launch Preparation
- [ ] Performance optimization
- [ ] Security audit
- [ ] User testing
- [ ] Documentation

---

## 🎯 Immediate Next Steps (Current Sprint)

### Week 1-2: Multiple File Management
1. **File Explorer**: Create sidebar with file tree
2. **File Tabs**: Implement tabbed interface for multiple files
3. **File Operations**: Create, rename, delete files
4. **Content Sync**: Maintain unsaved changes across file switches

### Week 3-4: Preview System
1. **KaTeX Setup**: Install and configure math rendering
2. **Split Layout**: Implement editor/preview panes
3. **Real-time Updates**: Connect editor changes to preview
4. **UI Polish**: Responsive design and UX improvements

---

## 📊 Progress Tracking

| Phase | Component | Status | Completion |
|-------|-----------|--------|------------|
| 1 | Monorepo Setup | ✅ | 100% |
| 1 | Supabase Config | ✅ | 100% |
| 2 | Authentication | ✅ | 100% |
| 2 | Project Management | ✅ | 100% |
| 2 | File System | ✅ | 100% |
| 3 | CodeMirror Editor | ✅ | 100% |
| 3 | File Management UI | 🚧 | 20% |
| 3 | Preview System | 🚧 | 0% |

**Overall Progress: 70% Complete**

---

## 🔮 Future Roadmap (v0.2+)

### Enhanced File Management
- Support for multiple LaTeX files with tabs
- Image and asset uploads
- Bibliography files (.bib)
- Custom templates
- File explorer with tree view

### Advanced Editor Features
- IntelliSense for LaTeX commands
- Snippet library
- Find and replace
- Multi-cursor editing

### Collaboration & Sharing
- Real-time collaborative editing
- Project sharing with permissions
- Export to GitHub/Overleaf
- Version control integration

### AI-Powered Features
- Smart error detection and fixes
- Writing style suggestions
- Automatic formatting
- Research assistance integration
