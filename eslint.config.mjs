import pluginJs from "@eslint/js";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {sourceType: "commonjs"}
    },
    {
        languageOptions: {
            globals: {
                "console": false,
                "Buffer": false,
            }
        },
        rules: {
            "mocha/no-mocha-arrows": "off",
            "mocha/consistent-spacing-between-blocks": "off",
        }
    },
  {
      ignores: [
          'coverage/*'
      ]
  },
    pluginJs.configs.recommended,
];
