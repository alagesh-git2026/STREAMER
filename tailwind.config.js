/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        text: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          card: "#FFFFFF",
          light: "#F1F5F9",
          hover: "#F8FAFC",
          border: "#E2E8F0",
          subtle: "#F8FAFC"
        },
        streamer: {
          science: "#2255A4",
          technology: "#0E7C6F",
          research: "#B65529",
          engineering: "#5A3FA0",
          arts: "#C23768",
          mathematics: "#41722E",
          entrepreneurship: "#9A6C10",
          resilience: "#1D6FA5"
        },
        rubric: {
          emerging: "#DC2626",
          developing: "#D97706",
          proficient: "#2563EB",
          advanced: "#059669"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
