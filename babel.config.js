/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  
};
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '/*': ['./'],
          // assets: './src/assets',
          // components: './src/components',
          // features: './src/features',
          // navigation: './src/navigation',
          // resources: './src/resources',
          // services: './src/services',
          // share: './src/share',
          // store: './src/store',
          // utils: './src/utils',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
    ['react-native-worklets/plugin', workletsPluginOptions],
  ],
};
