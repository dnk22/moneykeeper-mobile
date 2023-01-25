module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
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
    'react-native-reanimated/plugin',
  ],
};
