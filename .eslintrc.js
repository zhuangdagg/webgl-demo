module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['prettier'],
  // "@vue/prettier"  "plugin:prettier/recommended"
  extends: [
    // 'plugin:vue/essential',
    'plugin:prettier/recommended' /* , "@vue/prettier", "@vue/typescript" */,
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': 'error',
    // "indent": [2, 2],
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
};
