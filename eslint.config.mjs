import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Backend (Node.js) configuration
  {
    files: ["**/*.js"], // Apply to all .js files by default
    ignores: ["frontend/**/*.js"], // Ignore frontend files for this config
    languageOptions: {
      sourceType: "commonjs", // Use CommonJS for Node.js
      globals: {
        ...globals.node, // Include Node.js-specific globals like `process`
      },
    },
    rules: {
      "no-unused-vars": "warn", // Warn for unused variables
      "no-undef": "error", // Error for undefined variables
    },
  },
  // Frontend (Browser) configuration
  {
    files: ["frontend/**/*.js"], // Apply only to files in the `frontend` folder
    languageOptions: {
      sourceType: "module", // Use ES modules for modern browser code
      globals: {
        ...globals.browser, // Include browser-specific globals like `document` and `window`
      },
    },
    rules: {
      "no-unused-vars": "warn", // Warn for unused variables
      "no-undef": "error", // Error for undefined variables
    },
  },
];