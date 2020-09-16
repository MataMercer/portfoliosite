module.exports = {
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'jest', 'prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    // incompatible with NextJS links that require anchor tags with no href.
    'import/no-extraneous-dependencies': 'off',
    // Doesn't work with reacstrap as it needs classnames. Devs should also be smart enough to know to install all needed dependencies.
    'react/jsx-props-no-spreading': 'off',
    // react dropzone and nextjs require syntax that has prop spreading
    'import/extensions': 'off',
    // turn off import errors from importing .tsx files because eslint doesn't recognize typescript extensions
    'react/react-in-jsx-scope': 'off',
    // Nextjs doesn't require react import.
    'react-hooks/rules-of-hooks': 'warn',
    // show errors when not following rules of hooks.
    'no-unused-expressions': [
      'warn',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ], // https://eslint.org/docs/rules/no-unused-expressions
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '[I]\\w+',
      },
    ],
    // Only show warnings instead of errors for unused vars. Show no warning for imports that start with letter I because they are Typescript interfaces.
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ], // also want to use with ".tsx"
  },
};
