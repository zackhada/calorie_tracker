/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0a0f',
          900: '#0f1117',
          800: '#161822',
          700: '#1e2030',
          600: '#2a2d3e',
          500: '#3a3d50',
        },
        neon: {
          cyan: '#00f0ff',
          green: '#00ff88',
          red: '#ff3355',
          amber: '#ffaa00',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.15)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.15)',
        'neon-red': '0 0 20px rgba(255, 51, 85, 0.2)',
      },
    },
  },
  plugins: [],
};
