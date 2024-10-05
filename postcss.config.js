module.exports = {
  plugins: {
    tailwindcss: {}, // Enable Tailwind CSS
    autoprefixer: {}, // Add vendor prefixes for cross-browser compatibility
    "postcss-preset-env": {
      // Optional PostCSS plugin to use modern CSS features
      stage: 1,
      features: {
        "nesting-rules": true, // Enable nesting like in Sass
      },
    },
  },
};
