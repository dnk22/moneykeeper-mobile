import { COLOR_SCHEME, COMMON_THEME_COLOR } from './constants';
/**
 * Colors containing for dark theme
 */

const baseColor = {
  divider: 'rgba(255, 255, 255, 0.12)',
  text: '#FFFFFF',
  border: '#424242',
  textSecondary: '#BDBDBD',
  surface: '#1E1E1E',
  ...COMMON_THEME_COLOR,
};

const darkMode: Record<COLOR_SCHEME, any> = {
  [COLOR_SCHEME.modernBlue]: {
    ...baseColor,
    primary: '#4A90E2',
    primaryVariant: '#5A9BEF',
    background: '#121212',
  },
  [COLOR_SCHEME.elegantGreen]: {
    ...baseColor,
    primary: '#FF6F61',
    primaryVariant: '#FF8A75',
    background: '#121212',
  },
  [COLOR_SCHEME.techPurple]: {
    ...baseColor,
    primary: '#8E44AD',
    primaryVariant: '#9B59B6',
    background: '#121212',
  },
};
export default darkMode;
