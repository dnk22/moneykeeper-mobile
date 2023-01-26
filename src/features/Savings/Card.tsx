import { memo, useCallback, useRef, useState } from 'react';
import { RNText, SvgIcon, PressableHaptic } from 'components/index';
import { LayoutChangeEvent, View } from 'react-native';
import isEqual from 'react-fast-compare';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

const wrapperHeightDefault = 40;

function Card() {
  const { colors } = useCustomTheme();

  // get content wrapper height
  const contentWrapperHeight = useRef<number>(0);
  const wrapperHeight = useSharedValue(wrapperHeightDefault);

  const findDimensionsContentWrapper = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    contentWrapperHeight.current = height;
    wrapperHeight.value = height + wrapperHeightDefault;
  }, []);

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(wrapperHeight.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const onCardToggle = () => {
    // total height = [ header height ] + [ content height ]
    wrapperHeight.value =
      wrapperHeight.value === wrapperHeightDefault
        ? contentWrapperHeight.current + wrapperHeightDefault
        : wrapperHeightDefault;
  };

  return (
    <Animated.View
      style={[styles.wrapper, wrapperAnimatedStyle, { backgroundColor: colors.surface }]}
    >
      <PressableHaptic style={styles.header} onPress={onCardToggle}>
        <RNText style={styles.title}>Đang sử dụng:</RNText>
        <SvgIcon name="arrowDown" size={16} />
      </PressableHaptic>
      <View style={styles.content} onLayout={findDimensionsContentWrapper}>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
        <RNText>Content</RNText>
      </View>
    </Animated.View>
  );
}
export default memo(Card, isEqual);
