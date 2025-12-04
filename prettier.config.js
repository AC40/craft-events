module.exports = {
  // These settings are duplicated in .editorconfig:
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  printWidth: 80,
  trailingComma: "es5",
  bracketSpacing: true,
  overrides: [
    {
      files: "*.js",
      options: {
        parser: "flow",
      },
    },
  ],
};
