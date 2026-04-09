const path = require("path")

// get the path of the dependency "@freshbox-medusa/ui"
const medusaUI = path.join(
  path.dirname(require.resolve("@freshbox-medusa/ui")),
  "**/*.{js,jsx,ts,tsx}"
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@freshbox-medusa/ui-preset")],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", medusaUI],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
}
