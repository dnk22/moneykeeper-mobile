import { useTheme, Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';
import { COLOR_SCHEME, TBaseTheme } from './constants';

export type CustomTheme = TBaseTheme & Theme;

export const getTheme = (darkMode: boolean, color: COLOR_SCHEME) => ({
  dark: darkMode,
  colors: {
    ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
    ...(darkMode ? darkTheme[color] : lightTheme[color]),
  },
  fonts: DefaultTheme.fonts,
});

export const useAppTheme = ({
  darkMode,
  color,
}: {
  darkMode: boolean;
  color: COLOR_SCHEME;
}): CustomTheme => {
  return getTheme(darkMode, color);
};

const useCustomTheme = (): CustomTheme => {
  return useTheme() as CustomTheme;
};

export { useCustomTheme };
