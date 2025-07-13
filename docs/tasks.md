# 📋 Stage 1 Tasks: Setup & Scaffolding

## 🎯 Overview
This document outlines the detailed tasks for Stage 1 of PaperForge development, focusing on setting up the monorepo structure and initializing Supabase backend.

---

## 🔹 Stage 1.1 – Init Monorepo

### Task 1.1.1: Initialize Project Structure
- [ ] Run `pnpm init` in root directory
- [ ] Configure basic package.json with workspace settings
- [ ] Set up Git repository with `.gitignore`

### Task 1.1.2: Configure pnpm Workspace
- [ ] Create `pnpm-workspace.yaml` file
- [ ] Configure workspace patterns for apps and packages
- [ ] Run `pnpm install -w` to install workspace dependencies
- [ ] Verify workspace configuration

### Task 1.1.3: Create Directory Structure
- [ ] Create `apps/` directory
- [ ] Create `apps/landing/` for marketing site
- [ ] Create `apps/frontend/` for main NextJS latext editor
- [ ] Create `apps/backend/` for FastAPI service 
- [ ] Create `packages/` directory
- [ ] Create `packages/shared-types/` for shared TypeScript types
- [ ] Create `supabase/` directory for database setup
- [ ] Create `docker/` directory for Tectonic LaTeX scripts
- [ ] Create `stripe/` directory for billing logic (placeholder)

### Task 1.1.4: Setup Development Configuration
- [ ] Create root `.env.example` file with required variables
- [ ] Create root `README.md` with project overview
- [ ] Setup ESLint and Prettier configuration (shared)
- [ ] Create `tsconfig.json` for TypeScript configuration

---

## 🔹 Stage 1.2 – Supabase Init

### Task 1.2.1: Initialize Supabase
- [ ] Install Supabase CLI globally
- [ ] Run `supabase init` in the supabase directory
- [ ] Configure Supabase project settings
- [ ] Create local development environment

### Task 1.2.2: Database Schema Setup
- [ ] Create `projects` table schema
- [ ] Define table columns: id, user_id, title, content, created_at, updated_at
- [ ] Set up proper data types and constraints
- [ ] Create database migration file

### Task 1.2.3: Setup Row Level Security (RLS)
- [ ] Enable RLS on `projects` table
- [ ] Create policy: `auth.uid() = user_id` for SELECT
- [ ] Create policy: `auth.uid() = user_id` for INSERT
- [ ] Create policy: `auth.uid() = user_id` for UPDATE
- [ ] Create policy: `auth.uid() = user_id` for DELETE
- [ ] Test RLS policies

### Task 1.2.4: Schema Management
- [ ] Apply migrations to local database
- [ ] Run `supabase db pull` to sync schema
- [ ] Generate TypeScript types from schema
- [ ] Verify database connection and setup

---

## 🔹 Stage 1.3 – Initial Package Configuration

### Task 1.3.1: Shared Types Package
- [ ] Initialize `packages/shared-types/` with package.json
- [ ] Install Zod for runtime type validation
- [ ] Create base types for Project, User, etc.
- [ ] Setup build process for shared types

### Task 1.3.2: Development Dependencies
- [ ] Install TypeScript in workspace root
- [ ] Install development tools (ESLint, Prettier, etc.)
- [ ] Configure cross-package type checking
- [ ] Setup workspace scripts in root package.json

---

## ✅ Stage 1 Completion Criteria

- [ ] Monorepo structure is properly set up with pnpm workspaces
- [ ] All required directories are created and structured
- [ ] Supabase is initialized with proper database schema
- [ ] RLS policies are configured and tested
- [ ] Database schema is synced and types are generated
- [ ] Development environment is ready for Phase 2

---

## 🚀 Next Steps
Once Stage 1 is complete, proceed to Stage 2.1 (Auth setup) in the execution plan.
