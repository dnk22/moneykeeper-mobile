import React, { forwardRef, memo, useImperativeHandle } from 'react';
import isEqual from 'react-fast-compare';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'share/dimensions';
import { useCustomTheme } from 'resources/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Safe Area Insets Top :
 * < iPhone14 series : <= 47pt
 * > iPhone14 series : 47 ~ 59pt
 * to invisible popup , set margin top equals average Safe Area Insets Top all device
 */

const notchSize = 10;
const init = {
  height: 0,
  width: 100,
  borderRadius: 30,
  containerHeight: 0,
};
const target = {
  height: SCREEN_HEIGHT / 2.5,
  width: SCREEN_WIDTH - 20,
  borderRadius: 17,
  containerHeight: SCREEN_HEIGHT,
};

type DynamicIslandProps = {
  children?: React.ReactNode;
  height?: number;
};

type DynamicIslandHandle = {
  onToggle: () => void;
};

const DynamicIsland = forwardRef<DynamicIslandHandle, DynamicIslandProps>(
  ({ children, height = target.height }, forwardedRef) => {
    const { colors } = useCustomTheme();
    const { top: topSafeAreaHeight } = useSafeAreaInsets();
    const marginTop = topSafeAreaHeight / 2 - notchSize;

    const widthAnimated = useSharedValue(init.width);
    const heightAnimated = useSharedValue(init.height);
    const topAnimated = useSharedValue(marginTop);
    const borderRadiusAnimated = useSharedValue(init.borderRadius);
    const containerHeightAnimated = useSharedValue(0);

    useImperativeHandle(forwardedRef, () => ({
      onToggle,
    }));

    const containerAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: withTiming(containerHeightAnimated.value, {
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      };
    });

    const popupAnimatedStyles = useAnimatedStyle(() => {
      return {
        width: withTiming(widthAnimated.value, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        height: withTiming(heightAnimated.value, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        top: withTiming(topAnimated.value, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        borderRadius: withTiming(borderRadiusAnimated.value, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      };
    });

    const onToggle = () => {
      //width
      widthAnimated.value =
        widthAnimated.value === init.width ? target.width : init.width;
      //height
      heightAnimated.value =
        heightAnimated.value === init.height ? height : init.height;
      //top
      topAnimated.value =
        topAnimated.value === marginTop ? topSafeAreaHeight : marginTop;
      //borderRadius
      borderRadiusAnimated.value =
        borderRadiusAnimated.value === init.borderRadius
          ? target.borderRadius
          : init.borderRadius;
      //container height
      containerHeightAnimated.value =
        containerHeightAnimated.value === init.containerHeight
          ? target.containerHeight
          : init.containerHeight;
    };

    return (
      <Animated.View
        style={[
          styles.container,
          { width: SCREEN_WIDTH },
          containerAnimatedStyle,
        ]}
        onTouchEnd={onToggle}
      >
        <Animated.View
          style={[
            styles.popup,
            { backgroundColor: colors.surface },
            popupAnimatedStyles,
          ]}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {children}
        </Animated.View>
      </Animated.View>
    );
  }
);

export default memo(DynamicIsland, isEqual);
