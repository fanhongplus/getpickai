import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 主色——深墨蓝
        primary: {
          DEFAULT: "#1a1f36",
          light: "#2d3352",
        },
        // 强调色——明亮蓝
        accent: {
          DEFAULT: "#4f6ef7",
          hover: "#3d5bd9",
          bg: "#eef1fe",
        },
        // 场景标签色系
        tag: {
          write: "#818cf8",
          image: "#f472b6",
          video: "#fb923c",
          voice: "#34d399",
          code: "#60a5fa",
          productivity: "#a78bfa",
          marketing: "#f87171",
          language: "#2dd4bf",
          design: "#e879f9",
        },
        // 价格标签
        price: {
          free: "#10b981",
          trial: "#3b82f6",
          paid: "#f59e0b",
        },
        // 中性色
        bg: {
          DEFAULT: "var(--bg)",
          soft: "var(--bg-soft)",
          muted: "var(--bg-muted)",
        },
        text: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      lineHeight: {
        'body': '1.8',
        'heading': '1.3',
      },
      borderRadius: {
        'card': '14px',
        'btn': '10px',
        'tag': '6px',
        'logo': '10px',
      },
      spacing: {
        'section': '4rem',
        'section-title': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
