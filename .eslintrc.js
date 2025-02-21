// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "prettier/prettier": "error",
    // Typescript checks this
    "import/no-unresolved": "off",
    // // Lets keep our code lean
    // "@typescript-eslint/no-unused-vars": "error",
    // // Come on, we're better than that
    // "@typescript-eslint/no-explicit-any": "error",
    // "@typescript-eslint/no-unnecessary-type-assertion": "error",
    // // Ensures things like fetch don't return with any and need to be typed
    // "@typescript-eslint/explicit-module-boundary-types": "error",
  },
};
