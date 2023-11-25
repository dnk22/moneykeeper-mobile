import React, { useEffect, useRef } from 'react';
import { RNText, SvgIcon, PressableHaptic } from 'components/index';
import { Animated } from 'react-native';
import styles from './styles';

type HeaderProps = {
  onPress?: () => void;
  title?: string;
  isActive?: boolean;
};
function Header({ onPress, title, isActive }: HeaderProps) {
  const rotateAnim = useRef(new Animated.Value(1)).current;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isActive ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <PressableHaptic style={styles.header} onPress={onPress}>
      <RNText style={styles.title}>{title}</RNText>
      <Animated.View style={[styles.iconDropdown, { transform: [{ rotate: rotate }] }]}>
        <SvgIcon name="remote" />
      </Animated.View>
    </PressableHaptic>
  );
}
export default Header;
