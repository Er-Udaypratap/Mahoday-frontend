/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1, filter: "drop-shadow(0 0 6px rgba(251,191,36,0.9))" },
          "50%": { opacity: 0.25, filter: "drop-shadow(0 0 0px rgba(251,191,36,0))" },
        },
        twinkle: {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: 1 },
        },
        shoot: {
          "0%": { transform: "translate(0,0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { transform: "translate(-220px, 160px)", opacity: 0 },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        blink: "blink 0.9s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        shoot: "shoot 2.2s linear infinite",
        drift: "drift 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
