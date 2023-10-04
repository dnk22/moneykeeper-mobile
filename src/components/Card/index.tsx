import { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import Collapsible from 'react-native-collapsible';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';

export type CardProps = {
  children?: React.ReactNode;
  title?: string;
  collapse: boolean;
  renderKey: any;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

function Card({
  children,
  title,
  collapse = false,
  disabled = false,
  renderKey,
  containerStyle,
}: CardProps) {
  const { colors } = useCustomTheme();
  const [isCollapse, setIsCollapse] = useState(collapse);
  const rotateAnim = useRef(new Animated.Value(1)).current;
  const collapseStatus = disabled ? false : isCollapse;

  useEffect(() => {
    setIsCollapse(collapse);
  }, [collapse]);

  const onCardToggle = () => {
    setIsCollapse(!isCollapse);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isCollapse ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isCollapse]);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      {!disabled && (
        <PressableHaptic style={styles.header} onPress={onCardToggle}>
          <RNText style={styles.title}>{title}</RNText>
          <Animated.View style={[styles.iconDropdown, { transform: [{ rotate: rotate }] }]}>
            <SvgIcon name="remote" />
          </Animated.View>
        </PressableHaptic>
      )}
      <Collapsible
        style={[styles.content, containerStyle]}
        collapsed={collapseStatus}
        key={renderKey}
      >
        {children}
      </Collapsible>
    </View>
  );
}
export default Card;
