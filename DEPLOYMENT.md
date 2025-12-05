# Deployment Guide for VoiceTasker

This guide explains how to deploy your VoiceTasker application to the web. Since this is a React application built with Vite, it can be easily deployed to static hosting platforms like **Vercel** or **Netlify**.

## Option 1: Deploy to Vercel (Recommended)

Vercel is the creators of Next.js and provides excellent support for Vite projects.

1.  **Create a Vercel Account:**
    *   Go to [vercel.com](https://vercel.com) and sign up (login with GitHub is recommended).

2.  **Import Project:**
    *   Click on **"Add New..."** -> **"Project"**.
    *   Select your `voicetasker` repository from the list.
    *   Click **"Import"**.

3.  **Configure Project:**
    *   **Framework Preset:** It should automatically detect `Vite`.
    *   **Root Directory:** Leave as `./`.
    *   **Build Command:** `npm run build` (default).
    *   **Output Directory:** `dist` (default).

4.  **Environment Variables (CRITICAL):**
    *   Expand the **"Environment Variables"** section.
    *   Add your Gemini API Key:
        *   **Name:** `VITE_GEMINI_API_KEY`
        *   **Value:** `your_actual_api_key_here` (Copy this from your local `.env.local` file).
    *   Click **"Add"**.

5.  **Deploy:**
    *   Click **"Deploy"**.
    *   Wait for the build to finish. Once done, you will get a live URL (e.g., `https://voicetasker.vercel.app`).

---

## Option 2: Deploy to Netlify

1.  **Create a Netlify Account:**
    *   Go to [netlify.com](https://netlify.com) and sign up.

2.  **Import Project:**
    *   Click **"Add new site"** -> **"Import from an existing project"**.
    *   Select **GitHub**.
    *   Authorize Netlify and pick your `voicetasker` repository.

3.  **Build Settings:**
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`

4.  **Environment Variables:**
    *   Click on **"Show advanced"** or go to **"Site configuration"** > **"Environment variables"** after the site is created.
    *   Add a new variable:
        *   **Key:** `VITE_GEMINI_API_KEY`
        *   **Value:** `your_actual_api_key_here`

5.  **Deploy:**
    *   Click **"Deploy site"**.

---

## Important Notes

*   **Environment Variables:** Since this is a client-side application, your API key will be exposed in the browser's network requests. This is generally acceptable for personal projects or prototypes using free tier keys. For production apps with paid keys, you should proxy requests through a backend server to hide the key.
*   **Updates:** Any time you push code to your `main` branch on GitHub, Vercel/Netlify will automatically rebuild and redeploy your site.
