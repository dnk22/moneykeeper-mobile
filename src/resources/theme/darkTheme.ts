import { COLOR_SCHEME } from './constants';
/**
 * Colors containing for dark theme
 */

const commonColor = {
  divider: 'rgba(255, 255, 255, 0.12)',
  text: '#FFFFFF',
  border: '#424242',
  textSecondary: '#BDBDBD',
  surface: '#1E1E1E',
};

const darkMode: Record<COLOR_SCHEME, any> = {
  [COLOR_SCHEME.modernBlue]: {
    primary: '#4A90E2',
    primaryVariant: '#5A9BEF',
    background: '#121212',
    error: '#EF5350',
    success: '#66BB6A',
    ...commonColor,
  },
  [COLOR_SCHEME.elegantGreen]: {
    primary: '#FF6F61',
    primaryVariant: '#FF8A75',
    background: '#121212',
    error: '#E57373',
    success: '#81C784',
    ...commonColor,
  },
  [COLOR_SCHEME.techPurple]: {
    primary: '#8E44AD',
    primaryVariant: '#9B59B6',
    background: '#121212',
    error: '#E57373',
    success: '#81C784',
    ...commonColor,
  },
};
export default darkMode;
