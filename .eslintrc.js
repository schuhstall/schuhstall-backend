module.exports = {
  extends: ['@jonny', 'plugin:import/typescript'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    'fp/no-mutating-methods': 'off',
    '10x/react-in-scope': 'error',
    'ts-exports/unused-exports': 'off',
    'default-param-last': 'off',
    'react/boolean-prop-naming': 'off',
    'new-cap': 'off',
    'no-negated-condition': 'off',
  },
  globals: {
    __DEV__: true,
  },
};
