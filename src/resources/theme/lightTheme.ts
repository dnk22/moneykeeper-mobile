import { COLOR_SCHEME } from './constants';
/**
 * Colors containing for light theme
 */

const commonColor = {
  divider: 'rgba(0, 0, 0, 0.12)',
  text: '#212121',
  border: '#E0E0E0',
  textSecondary: '#757575',
  surface: '#FFFFFF',
};

const lightMode: Record<COLOR_SCHEME, any> = {
  // xanh năng động
  [COLOR_SCHEME.modernBlue]: {
    ...commonColor,
    primary: '#4A90E2',
    primaryVariant: '#5A9BEF',
    background: '#F5F7FA',
    error: '#E53935',
    success: '#43A047',
  },
  // xanh thanh lịch
  [COLOR_SCHEME.elegantGreen]: {
    primary: '#FF6F61',
    primaryVariant: '#FF8A75',
    background: '#FFF8F6',
    error: '#D32F2F',
    success: '#388E3C',
    ...commonColor,
  },
  // tím công nghệ
  [COLOR_SCHEME.techPurple]: {
    primary: '#8E44AD',
    primaryVariant: '#9B59B6',
    background: '#F9F3FA',
    error: '#C62828',
    success: '#2E7D32',
    ...commonColor,
  },
};

export default lightMode;
