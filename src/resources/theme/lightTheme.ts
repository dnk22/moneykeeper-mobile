import { COLOR_SCHEME, COMMON_THEME_COLOR } from './constants';
/**
 * Colors containing for light theme
 */

const baseColor = {
  divider: 'rgba(0, 0, 0, 0.12)',
  text: '#212121',
  border: '#E0E0E0',
  textSecondary: '#757575',
  surface: '#FFFFFF',
  ...COMMON_THEME_COLOR,
};

const lightMode: Record<COLOR_SCHEME, any> = {
  // xanh năng động
  [COLOR_SCHEME.modernBlue]: {
    ...baseColor,
    primary: '#2567E8',
    primaryVariant: '#4A90E2',
    background: '#F5F7FA',
  },
  // xanh thanh lịch
  [COLOR_SCHEME.elegantGreen]: {
    ...baseColor,
    primary: '#FF6F61',
    primaryVariant: '#FF8A75',
    background: '#FFF8F6',
  },
  // tím công nghệ
  [COLOR_SCHEME.techPurple]: {
    ...baseColor,
    primary: '#8E44AD',
    primaryVariant: '#9B59B6',
    background: '#F9F3FA',
  },
};

export default lightMode;
