import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist", ".next", "out", "node_modules"],
  },
];
