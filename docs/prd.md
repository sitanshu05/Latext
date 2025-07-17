# 📄 Product Requirements Document (PRD)

## 🧠 Project Name: LaTeX (formerly PaperForge)  
An AI-powered LaTeX writing tool for researchers that simplifies writing, formatting, and exporting academic papers — with features Overleaf lacks.

Think of this project as a fork of overleaf with AI features

---

## 🎯 Problem Statement

Researchers face challenges with:
- Tedious LaTeX formatting
- Generating citations properly
- Writing precise academic English
- Fixing math syntax or grammar manually
- Delayed or clunky PDF export

**Goal**: Deliver a clean, Overleaf-style experience with AI tools to reduce friction, boost quality, and save time.

---

## 🛠️ Core Features (v1)

### ✍️ LaTeX Editor ✅ **IMPLEMENTED**
- CodeMirror Editor (VS Code-like experience)
- LaTeX syntax highlighting with custom language definition
- Auto-save with 900ms debounce and real-time status indicators
- LaTeX command autocompletion (50+ commands)
- Multiple themes (Light, Dark, GitHub, VS Code)
- Keyboard shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+F, Ctrl/Cmd+B, Ctrl/Cmd+I)
- Professional file editing interface with status bar

### 👁️ Real-time Preview
- KaTeX or MathJax for math rendering
- Optional full `.tex` → PDF preview
- Toggle live/compiled view

### 🤖 AI Assistants
- Rewrite selected text (via GPT/Gemini)
- Natural language → math equation (LaTeX)
- Citation by DOI or title → BibTeX
- Smart autocomplete suggestions

### 📄 PDF Compiler
- Compile `.tex` source via backend (Tectonic)
- Download compiled PDF
- Status: success/error/toast on compile

### 🔐 Auth + Projects ✅ **IMPLEMENTED**
- Supabase Auth (email/magic link)
- Save projects by user
- Load previous projects easily
- **File Management**: Automatic main.tex creation with LaTeX template
- **Auto-save**: Real-time file persistence with status indicators

---

## 🧱 Architecture Overview

| Layer        | Technology                    | Status |
|--------------|-------------------------------|---------|
| Frontend     | Next.js + CodeMirror + Tailwind | ✅ Complete |
| Auth & DB    | Supabase                      | ✅ Complete |
| Backend API  | FastAPI                       | 🚧 Planned |
| AI Services  | Gemini / GPT-4 APIs           | 🚧 Planned |
| PDF Compile  | Tectonic LaTeX in Docker      | 🚧 Planned |
| Deployment   | Vercel (frontend), Render (backend) | 🚧 Planned |

---

## 📦 Monorepo Structure (pnpm workspaces)

```bash
latext/
├── apps/
│   ├── frontend/          # Main LaTeX editor UI (Next.js) ✅
│   └── backend/           # FastAPI service (AI + Compile APIs) 🚧
├── supabase/              # Supabase schema + migrations + config ✅
│   ├── migrations/        # Database migrations ✅
│   └── schemas/           # Table definitions ✅
├── docs/                  # Documentation ✅
├── .env                   # Local environment secrets ✅
├── pnpm-workspace.yaml    # Workspace declaration ✅
└── README.md              # Project overview ✅
```

---

## 🗄️ Database Schema (Implemented)

### Projects Table ✅
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Files Table ✅
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Key Features:**
- Every project automatically gets a `main.tex` file with LaTeX template
- File content stored directly in database with real-time auto-save
- Proper RLS policies for user isolation
- Cascade deletion maintains data consistency
- Professional editor with syntax highlighting and autocompletion

---

## 🎯 Current Implementation Status

### ✅ **Completed (v0.2)**
- **Project Management**: Full CRUD operations
- **File System**: Automatic main.tex creation with LaTeX template
- **Authentication**: Supabase Auth integration
- **Database**: Projects and Files tables with RLS
- **LaTeX Editor**: CodeMirror with syntax highlighting and autocompletion
- **Auto-save**: Real-time file persistence with status indicators
- **UI**: Professional project listing and file editing interface
- **Type Safety**: Full TypeScript integration with generated Supabase types

### 🚧 **In Progress**
- Multiple file management (file switching, tabs)
- Real-time preview with KaTeX/MathJax

### 🔮 **Planned (v0.3+)**
- PDF compilation (Tectonic)
- AI writing assistance
- Citation management
- Real-time collaboration
- Advanced LaTeX templates

---

## 🎨 UI/UX Design Principles

- **Simplicity First**: Clean, distraction-free writing environment
- **LaTeX-Native**: Optimized for LaTeX syntax and workflows
- **Instant Feedback**: Real-time preview and error detection
- **AI-Enhanced**: Seamless integration of AI tools
- **Researcher-Focused**: Built for academic writing patterns

---

## 📊 Success Metrics

### User Engagement
- Project creation rate
- Session duration in editor
- LaTeX compilation success rate

### Feature Adoption
- AI tool usage frequency
- Template utilization
- Collaboration feature usage

### Technical Performance
- Page load times
- Compilation speed
- Error rates
