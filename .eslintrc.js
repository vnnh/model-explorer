module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		jsx: true,
		project: ["./tsconfig.json"],
	},
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	rules: {
		"prettier/prettier": [
			"warn",
			{
				semi: true,
				trailingComma: "all",
				singleQuote: false,
				printWidth: 120,
				tabWidth: 4,
				useTabs: true,
			},
		],
		"no-empty-function": "off",
		"@typescript-eslint/no-empty-function": 0,
		"@typescript-eslint/no-unused-vars": 0,
		"prefer-const": 0,
		"@typescript-eslint/no-array-constructor": 0,
	},
};
