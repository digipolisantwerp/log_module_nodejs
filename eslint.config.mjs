import globals from "globals";
import pluginJs from "@eslint/js";


export default [
    {
        files: ["**/*.js"],
        languageOptions: {sourceType: "commonjs"}
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
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
