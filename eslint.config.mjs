import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.node,
        mediumZoom: "readonly",
        gtag: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_|^e$" }],
      "no-undef": "error",
      "prefer-const": "warn",
      "no-var": "warn",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "multi-line"],
      "no-console": "off", // Console allowed for analytics logging
    },
    ignores: ["_site/**", "node_modules/**", "vendor/**", ".jekyll-cache/**"],
  },
];
