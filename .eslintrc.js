// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    // eslint-disable-next-line no-undef
    tsconfigRootDir: __dirname, // Ensures correct resolution of tsconfig
  },
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*"],
  rules: {
    "no-console": "error",
    "prettier/prettier": "warn",
    // Typescript checks this
    "import/no-unresolved": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector: "NewExpression[callee.name='Error']",
        message:
          "Use AppError from '@/classes/AppError' instead of the Error class.",
      },
    ],
    // // Lets keep our code lean
    "@typescript-eslint/no-unused-vars": "error",
    // Come on, we're better than that
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
  },
  overrides: [
    {
      files: ["**/*.js"], // Target all JS files
      parser: "espree", // Use the default JavaScript parser
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
  ],
};
