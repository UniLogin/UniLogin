const baseConfig = require('./.eslintrc.json')

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:react/recommended',
  ],
  settings: {
    ...baseConfig.settings,
    react: {
      version: 'detect',
    },
  },
  env: {
    ...baseConfig.env,
    browser: true,
  },
  parserOptions: {
    ...baseConfig.parserOptions
  },
  plugins: [
    'react-hooks',
  ],
  rules: {
    ...baseConfig.rules,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  }
}
