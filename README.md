# 📄 PaperForge

An AI-powered LaTeX writing tool for researchers that simplifies writing, formatting, and exporting academic papers — with features Overleaf lacks.

## 🚀 Quick Start

This is a monorepo project using pnpm workspaces.

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Supabase CLI
- Docker (for LaTeX compilation)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd paperforge

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
pnpm dev
```

## 📦 Project Structure

```
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
```

## 🛠️ Technology Stack

- **Frontend**: Next.js + Monaco Editor + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 / Google Gemini
- **LaTeX**: Tectonic compiler in Docker
- **Deployment**: Vercel (frontend) + Render (backend)

## 🎯 Core Features

- **LaTeX Editor**: Monaco Editor with syntax highlighting
- **Real-time Preview**: KaTeX/MathJax math rendering
- **AI Assistants**: Text rewriting, citation generation, math equation conversion
- **PDF Compilation**: Tectonic LaTeX compiler
- **Project Management**: Save and load projects with Supabase
- **Authentication**: Supabase Auth with magic links

## 🔧 Development Scripts

```bash
# Start all development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint all packages
pnpm lint

# Clean build artifacts
pnpm clean
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

- Supabase credentials
- OpenAI/Gemini API keys
- Database URLs
- Stripe keys (optional)

## 🤝 Contributing

Please read our contributing guidelines before submitting pull requests.

## 📄 License

MIT License - see LICENSE file for details. 