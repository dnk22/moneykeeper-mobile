import { useTheme, Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';
import { COLOR_SCHEME, TBaseTheme } from './constants';
import { useColorScheme } from 'react-native';

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
  auto,
}: {
  darkMode: boolean;
  auto: boolean;
  color: COLOR_SCHEME;
}): CustomTheme => {
  const systemColorScheme = useColorScheme(); // 'dark' | 'light' | null
  const isDarkMode = auto ? systemColorScheme === 'dark' : darkMode;
  return getTheme(isDarkMode, color);
};

const useCustomTheme = (): CustomTheme => {
  return useTheme() as CustomTheme;
};

export { useCustomTheme };
