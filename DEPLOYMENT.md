# Deployment Guide

This project is separated into two parts:
1. **Frontend**: React (Vite)
2. **Backend**: Express + MongoDB

You will need to deploy them separately.

## 1. Backend Deployment (e.g., Render.com, Railway, Heroku)

The backend needs to be online first so you can get its URL.

### Steps:
1.  **Push your code to GitHub**.
2.  **Create a new Web Service** on your chosen provider (e.g., Render).
3.  **Connect your GitHub repo**.
4.  **Root Directory**: Set this to `backend`.
5.  **Build Command**: `npm install`
6.  **Start Command**: `node server.js`
7.  **Environment Variables**: You MUST set these in the dashboard:
    *   `MONGODB_URI`: Your MongoDB connection string (Atlas).
    *   `PORT`: `5000` (or leave default if provider attempts to set it).
    *   `API_KEY`: Your Gemini API Key (optional if you move AI logic to backend, but currently AI is on frontend).

**Once deployed, copy the URL (e.g., `https://voicetasker-backend.onrender.com`).**

## 2. Frontend Deployment (Vercel, Netlify)

Now deploy the frontend and point it to the backend.

### Steps:
1.  **Go to Vercel/Netlify** and import your GitHub repo.
2.  **Root Directory**: Set this to `frontend`.
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your backend URL here (e.g., `https://voicetasker-backend.onrender.com/api/tasks`).
        *   *Note: Do not add a trailing slash unless your code handles it.*
    *   `VITE_GEMINI_API_KEY`: Your Google Gemini API Key.

## 3. Local Development

To run locally, you need two terminals:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Ensure your `frontend/.env.local` contains:
```env
VITE_API_URL=http://localhost:5000/api/tasks
VITE_GEMINI_API_KEY=your_key_here
```
