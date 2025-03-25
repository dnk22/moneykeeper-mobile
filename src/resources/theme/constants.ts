export const HEADER_TITLE_FONT_SIZE = 20;
export const BOX_SHADOW = {
  shadowColor: 'gray',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 10,
};
export enum COLOR_SCHEME {
  modernBlue,
  elegantGreen,
  techPurple,
}
export enum THEME_MODE {
  LIGHT,
  DARK,
}

export const COMMON_THEME_COLOR = {
  success: '#888888',
  error: '#FF6B6B',
  alert: '#FFA500',
  link: '#4D81E7',
};

export type TBaseTheme = {
  colors: {
    textSecondary: string;
    divider: string;
    primaryVariant: string;
    error: string;
    success: string;
    surface: string;
    alert: string;
    link: string;
  };
};
