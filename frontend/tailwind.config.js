/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Syne'", "sans-serif"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      colors: {
        bg:       "#070b0f",
        bg2:      "#0d1117",
        bg3:      "#111820",
        surface:  "#141c26",
        surface2: "#1a2535",
        green:    "#00ffaa",
        "green-dim": "#00cc88",
        red:      "#ff4466",
        amber:    "#ffaa00",
        blue:     "#00aaff",
        text1:    "#e0f0e8",
        text2:    "#7a9e8e",
        text3:    "#3a5a4a",
        border1:  "rgba(0,255,170,0.08)",
        border2:  "rgba(0,255,170,0.18)",
      },
      keyframes: {
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        "glow-pulse": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(0,255,170,0.15)" },
          "50%":      { boxShadow: "0 0 16px 2px rgba(0,255,170,0.15)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        blink:       "blink 1s step-end infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out 1",
        spin:        "spin 0.7s linear infinite",
      },
      borderWidth: { "0.5": "0.5px" },
    },
  },
  plugins: [],
}
