/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import RnKeyboard from 'rn-keyboard'; // <-- Import here

RnKeyboard.registerComponent(); // <-- Add this line
AppRegistry.registerComponent(appName, () => App);
