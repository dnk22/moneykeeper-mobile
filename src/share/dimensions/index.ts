import { Dimensions } from 'react-native';
// prettier-ignore
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Scale item base on screen width and screen height
// Guideline sizes are based on standard ~5" screen mobile device
// prettier-ignore
const [shortDimension, longDimension] = SCREEN_WIDTH < SCREEN_HEIGHT ? [SCREEN_WIDTH, SCREEN_HEIGHT] : [SCREEN_HEIGHT, SCREEN_WIDTH];
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;
// prettier-ignore
const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;
// prettier-ignore
export const verticalScale = (size : number) => longDimension / guidelineBaseHeight * size;
// prettier-ignore
export const normalize = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// -----------------------------------------------------------

// begin system icon scale
export const DIMENSIONS = {
  home: {
    navbarHeight: normalize(40),
    title: normalize(16),
    viewReminderItemPadding: normalize(16),
    reminderItem: {
      fontSizeDateTimeCount: normalize(30),
      itemMarginBottom: normalize(10),
      itemBorderRadius: normalize(10),
      heightPin: normalize(120),
      height: normalize(80),
      reminderName: normalize(16),
      details: normalize(14),
    },
  },
};

export const ModalNavigationHeaderBarDimensions = {
  headerBarHeight: normalize(50),
  titleFontSize: normalize(20),
};

// system dimensions define
export const bottomBarHeight = 100;
