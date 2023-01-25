import {
  useTheme,
  Theme,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
}

export type ThemeColors = typeof lightTheme;

export type ThemeType = {
  colors: ThemeColors;
} & Theme;

const CustomLightTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    ...lightTheme,
  },
};

const CustomDarkTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    ...darkTheme,
  },
};

const MyAppTheme = {
  default: CustomLightTheme,
  dark: CustomDarkTheme,
};

const useCustomTheme = useTheme as () => ThemeType;

export { MyAppTheme, useCustomTheme, ThemeEnum };
