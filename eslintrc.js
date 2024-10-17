module.exports = {
	root: true,
	env: {
		node: true,
		jest: true,
		es6: true
	},
	ignorePatterns: ['.idea'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		project: './tsconfig.json',
		sourceType: 'module'
	},
	settings: {
		'import/extensions': ['.js', '.ts'],
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts']
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: 'tsconfig.json'
			}
		}
	},
	plugins: [
		'jest',
		'import',
		'prettier',
		// '',
		'@typescript-eslint'
	],
	extends: [
		'eslint:recommended',
		'airbnb-typescript/base',
		'plugin:jest/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:prettier/recommended',
		'prettier',
		'plugin:import/errors',
		'plugin:import/warnings'
	],

	rules: {
		'@typescript-eslint/indent': 'off',

		// 'prettier/prettier': 2,

		'jest/valid-title': 0,
		'jest/no-commented-out-tests': 0,
		'jest/expect-expect': 0,
		'jest/valid-describe': 0,

		'no-constant-condition': 0,
		'no-sparse-arrays': 0,
		'no-case-declarations': 0,
		'no-loop-func': 0,
		'guard-for-in': 0,
		'object-curly-newline': 'off',
		'implicit-arrow-linebreak': 'off',
		'linebreak-style': [0, 'unix'],
		'class-methods-use-this': 0,
		eqeqeq: 0, // TODO to 2
		'prefer-const': 0, // TODO to 2
		'consistent-return': 0, // TODO to 2
		'no-shadow': 0, // TODO to 2
		'no-multi-assign': 0, // TODO to 2
		'prefer-destructuring': 0, // TODO to 2
		'no-bitwise': 0, // TODO to 2
		'no-unused-expressions': 0,
		'no-tabs': 0,
		'no-empty': 0,
		'no-nested-ternary': 0,
		'default-case': 0,
		camelcase: 0,
		'no-console': 0,
		'comma-dangle': ['error', 'never'],
		'no-return-await': 0,
		'keyword-spacing': 0,
		'no-restricted-syntax': 0,
		semi: ['error', 'always'],
		'no-prototype-builtins': 0,
		'no-continue': 0,
		'no-throw-literal': 0,
		'no-useless-escape': 0,
		'max-len': [0, { code: 150 }],
		'no-mixed-spaces-and-tabs': 0,
		'no-await-in-loop': 0,
		'no-param-reassign': 0,
		'no-underscore-dangle': 0,
		radix: 0,
		'max-classes-per-file': 0,
		'no-plusplus': 0,
		'global-require': 0,
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		'no-implicit-globals': ['error'],
		'no-use-before-define': 0,
		'no-return-assign': 0,
		'no-restricted-globals': [0, 'closed', 'frames', 'history', 'length', 'location', 'name', 'navigator', 'opener', 'parent', 'screen', 'status', 'top'],
		'no-whitespace-before-property': 'error',
		'no-multi-spaces': 'error',
		'no-trailing-spaces': ['error', { ignoreComments: true }],
		'no-invalid-this': 0,
		'arrow-spacing': 'error',
		'space-infix-ops': ['error'],
		'require-jsdoc': 0,
		'valid-jsdoc': 0,
		'no-async-promise-executor': 0,
		'no-unused-vars': [
			0,
			{
				argsIgnorePattern: '^_'
			}
		],

		'import/no-unresolved': 0,
		'import/no-dynamic-require': 0,
		'import/extensions': 'off',
		'import/named': 0,
		'import/prefer-default-export': 0,
		'import/namespace': [
			0,
			{
				allowComputed: true
			}
		],
		'import/no-named-as-default': 0,
		'import/no-extraneous-dependencies': 0,
		'import/no-named-as-default-member': 0,

		'@typescript-eslint/restrict-template-expressions': 0,
		'@typescript-eslint/no-unsafe-argument': 0,

		'@typescript-eslint/no-loop-func': 0,
		'@typescript-eslint/naming-convention': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/no-unused-vars': 0,
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-unused-expressions': 0,
		'@typescript-eslint/no-shadow': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-throw-literal': 0,
		'@typescript-eslint/return-await': 0,
		'@typescript-eslint/ban-ts-comment': 0,
		'@typescript-eslint/comma-dangle': 0,
		'@typescript-eslint/no-empty-function': 0,
		'@typescript-eslint/ban-types': 0,
		'@typescript-eslint/no-unsafe-call': 0,
		'@typescript-eslint/no-unsafe-member-access': 0,
		'@typescript-eslint/no-unsafe-assignment': 0,
		'@typescript-eslint/no-unsafe-return': 0,
		'@typescript-eslint/require-await': 0,
		'@typescript-eslint/no-misused-promises': 0,
		'@typescript-eslint/no-floating-promises': 0,
		'@typescript-eslint/lines-between-class-members': 0,
		'@typescript-eslint/unbound-method': [
			'error',
			{
				ignoreStatic: true
			}
		]
	}
};
