# Donmedia

A React-based Multi-Page Application (MPA) powered by Vite and Supabase.

## 🚀 Deployment Guide

This project is configured for seamless deployment to **Cloudflare Pages**.

### 1. Prerequisites
- **Wrangler CLI**: `npm install -g wrangler`
- **Supabase Credentials**: You will need your project URL and Anon Key.

### 2. Configure Environment Variables
Create a `.env` file in the root directory (use `.env.example` as a template):
```ini
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Local Development
```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

### 4. Build and Deploy
The deployment workflow is automated to ensure reliability.

#### **Standard Deployment**
Run the following command to build and deploy to Cloudflare Pages:
```bash
npm run deploy
```

> [!IMPORTANT]
> The `deploy` script includes a safety check. It will **fail** if you have uncommitted changes in your Git repository. This ensures that the code you deploy is exactly what is stored in your version history.

#### **Manual Build Verification**
To just generate the production files without deploying:
```bash
npm run build
```
This will create a fresh, optimized `dist/` directory.

### 5. Cloudflare Pages Settings
If you are using the Cloudflare Dashboard for automatic Git-based deployments, ensures these settings are used:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Environment variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project settings in Cloudflare.

## 📁 Project Structure
- `/src`: React components and entry points.
- `/admin`: Dashboard and category management pages.
- `index.html`, `magazines.html`, etc.: High-performance Multi-Page entries.
- `vite.config.js`: Dynamic configuration that handles all pages automatically.
