/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark Backgrounds
                bg: {
                    DEFAULT: '#0f172a', // Slate 900
                    paper: '#1e293b',   // Slate 800
                    dark: '#020617',    // Slate 950
                },
                // Neon Accents
                accent: {
                    primary: '#8b5cf6',   // Violet 500
                    secondary: '#ec4899', // Pink 500
                    success: '#10b981',   // Emerald 500
                    warning: '#f59e0b',   // Amber 500
                    danger: '#ef4444',    // Red 500
                    info: '#3b82f6',      // Blue 500
                },
                text: {
                    primary: '#f8fafc',   // Slate 50
                    secondary: '#94a3b8', // Slate 400
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-primary': '0 0 20px rgba(139, 92, 246, 0.5)',
                'neon-secondary': '0 0 20px rgba(236, 72, 153, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
