import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        scanner: {
          bg: '#0a0a0b',
          'bg-secondary': '#111113',
          card: '#16161a',
          'card-hover': '#1c1c21',
          elevated: '#1e1e24',
          border: '#2a2a30',
          'border-subtle': '#1f1f24',
          accent: '#14b8a6',
          'accent-secondary': '#2dd4bf',
        },
        claimed: '#ef4444',
        reality: '#22c55e',
        status: {
          success: '#22c55e',
          active: '#3b82f6',
          warning: '#f59e0b',
          error: '#ef4444',
          muted: '#71717a',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '12px',
        sm: '8px',
        xs: '4px',
      },
    },
  },
} satisfies Config
