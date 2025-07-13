# 📄 Product Requirements Document (PRD)

## 🧠 Project Name: PaperForge  
An AI-powered LaTeX writing tool for researchers that simplifies writing, formatting, and exporting academic papers — with features Overleaf lacks.

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

### ✍️ LaTeX Editor
- Monaco Editor (VS Code-like)
- Syntax highlighting for LaTeX
- Auto-save with version control
- Snippet support (e.g., `\cite`, `\figure`)

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

### 🔐 Auth + Projects
- Supabase Auth (email/magic link)
- Save projects by user
- Load previous projects easily

---

## 🧱 Architecture Overview

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | Next.js + Monaco + Tailwind   |
| Auth & DB    | Supabase                      |
| Backend API  | FastAPI                       |
| AI Services  | Gemini / GPT-4 APIs           |
| PDF Compile  | Tectonic LaTeX in Docker      |
| Deployment   | Vercel (frontend), Render (backend)

---

## 📦 Monorepo Structure (pnpm workspaces)

```bash
paperforge/
├── apps/
│   ├── landing/           # Marketing site (Next.js)
│   ├── frontend/        # Main LaTeX editor UI (Next.js)
|   ├── backend/           # FastAPI service (AI + Compile APIs)
├── packages/
│   └── shared-types/      # Shared Zod/TS types between apps
├── supabase/              # Supabase schema + migrations + config
├── docker/                # Tectonic LaTeX Docker scripts
├── stripe/                # Stripe billing logic and webhooks
├── .env                   # Local environment secrets
├── pnpm-workspace.yaml    # Workspace declaration
└── README.md
