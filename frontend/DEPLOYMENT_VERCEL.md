# Deploying RentEase to Vercel

RentEase is configured for zero-configuration deployment to [Vercel](https://vercel.com).

---

## Option 1: Unified Full-Stack Deployment (Recommended)

Deploy both the Vite React frontend and Express REST API backend in a single Vercel project:

1. Push your codebase to a GitHub/GitLab repository.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project** and choose your repository.
3. Configure **Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
   - **Root Directory**: `./` (leave default)
4. Add **Environment Variables** in Vercel:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://saunnddryasr_db_user:<password>@cluster0.kk44seh.mongodb.net/rentease?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
   | `BACKEND_API_URL` | `https://<your-project>.vercel.app` | Self-referencing deployed URL |
   | `FRONTEND_URL` | `https://<your-project>.vercel.app` | Self-referencing deployed URL |
5. Click **Deploy**.

Vercel will automatically:
- Build the React SPA into static assets (`dist`) via `vercel.json`.
- Deploy `/api/index.ts` as a serverless API function handling all `/api/*` requests.
- Route any page navigation to `index.html`.

---

## Option 2: Deploying Separate Frontend & Backend Projects

If you prefer two separate Vercel projects:

### 1. Deploy the Backend
- Set Root Directory or select repository.
- Build Command: none needed (or `npm run build`).
- Set Environment Variables:
  - `MONGODB_URI`: your MongoDB Atlas URI.
- Your backend will be live at `https://<backend-project>.vercel.app/api`.

### 2. Deploy the Frontend
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Set Environment Variable:
  - `VITE_API_URL`: `https://<backend-project>.vercel.app/api`
- Your frontend will communicate directly with your separate backend deployment over CORS.

---

## Architecture Summary

- **`/frontend`**: React 19 SPA, Tailwind CSS v4, Lucide icons, responsive rental UI.
- **`/backend`**: Express REST API modularized by resource (`/routes/products.ts`, `/routes/orders.ts`, `/routes/tickets.ts`, etc.).
- **`/api`**: Vercel Serverless Function entry point (`/api/index.ts`).
- **`/vercel.json`**: Routing configuration for single-deployment API and SPA rewrites.
- **`server.ts`**: Local development server booting Vite middleware and Express API on port 3000.
