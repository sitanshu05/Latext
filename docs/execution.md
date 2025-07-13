
---

## 🛠️ Phase 1: Setup & Scaffolding

### 🔹 Stage 1.1 – Init Monorepo
- [ ] `pnpm init`
- [ ] `pnpm install -w`
- [ ] Set up `pnpm-workspace.yaml`
- [ ] Create `apps/`, `backend-api/`, `packages/`, `supabase/`

### 🔹 Stage 1.2 – Supabase Init
- [ ] `supabase init`
- [ ] Create `projects` table
- [ ] Add RLS: `auth.uid() = user_id`
- [ ] Pull schema: `supabase db pull`

---

## 🎨 Phase 2: Editor Frontend (Next.js)

### 🔹 Stage 2.1 – Auth
- [ ] Set up Supabase client
- [ ] Login / Signup pages
- [ ] Protect `/editor` route

### 🔹 Stage 2.2 – Monaco + Preview
- [ ] Monaco editor with LaTeX syntax
- [ ] Live KaTeX preview pane
- [ ] Save/load from Supabase `projects`

---

## 🧠 Phase 3: AI Features

### 🔹 Stage 3.1 – Rewrite Tool
- [ ] FastAPI `/rewrite` using OpenAI/Gemini
- [ ] Frontend: select → rewrite → replace

### 🔹 Stage 3.2 – Citation Generator
- [ ] Input DOI → fetch BibTeX via CrossRef API
- [ ] Insert into editor

### 🔹 Stage 3.3 – Math to LaTeX
- [ ] Natural language → equation → LaTeX
- [ ] Render and insert

---

## 📄 Phase 4: Compile & Export

### 🔹 Stage 4.1 – PDF Compilation
- [ ] FastAPI `/compile` → Tectonic in Docker
- [ ] Return PDF blob

### 🔹 Stage 4.2 – Preview & Download
- [ ] Display PDF
- [ ] Enable download button

---

## 🌐 Phase 5: Landing & Billing

### 🔹 Stage 5.1 – Landing Page
- [ ] Build marketing site (Next.js static)

### 🔹 Stage 5.2 – Stripe Integration (Optional)
- [ ] Add pricing tiers
- [ ] Handle subscription via webhook

---

## 🚀 Phase 6: Deploy & Launch

### 🔹 Stage 6.1 – Deployment
- [ ] Vercel: editor + landing
- [ ] Render/Fly.io: backend
- [ ] .env setup

### 🔹 Stage 6.2 – Launch
- [ ] Internal testing
- [ ] Publish + market beta

---

## 🔮 Future (v1.1+)

- Real-time editing (Y.js)
- Template system
- Citation manager
- GitHub sync
- Markdown → LaTeX converter
