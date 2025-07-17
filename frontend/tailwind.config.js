/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-slate-500/30': {},
        },
        '.btn-secondary': {
          '@apply bg-gradient-to-r from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 text-slate-800 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-slate-500/30 border border-slate-200': {},
        },
        '.btn-ghost': {
          '@apply bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105': {},
        },
        '.card': {
          '@apply bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 p-8': {},
        },
        '.card-hover': {
          '@apply bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 p-8 hover:transform hover:-translate-y-2 hover:scale-[1.02]': {},
        },
        '.input-field': {
          '@apply w-full px-6 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-500/30 focus:border-slate-500 transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500': {},
        },
        '.glass-effect': {
          '@apply backdrop-blur-md bg-white/90 border border-slate-200 shadow-xl': {},
        },
        '.glass-card': {
          '@apply backdrop-blur-lg bg-white/80 border border-slate-200 rounded-2xl shadow-2xl': {},
        },
        '.text-gradient': {
          '@apply bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent': {},
        },
        '.text-gradient-secondary': {
          '@apply bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent': {},
        },
        '.stat-card': {
          '@apply bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300': {},
        },
        '.feature-icon': {
          '@apply w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3': {},
        },
        '.table-row-hover': {
          '@apply hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-slate-50/50 transition-all duration-200': {},
        },
        '.badge-gold': {
          '@apply bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-bold': {},
        },
        '.badge-silver': {
          '@apply bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800 font-bold': {},
        },
        '.badge-bronze': {
          '@apply bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 font-bold': {},
        },
        '.badge-other': {
          '@apply bg-gradient-to-r from-slate-400 to-slate-500 text-white font-bold': {},
        },
      })
    }
  ],
} 