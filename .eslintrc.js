module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'vue/html-indent':'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline' :'off',
    'vue/html-self-closing':'off'
  }
}
