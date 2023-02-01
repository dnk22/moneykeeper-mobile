import { memo, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import isEqual from 'react-fast-compare';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import Collapsible from 'react-native-collapsible';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';

type CardProps = {
  children?: React.ReactElement;
  title?: string;
};

function Card({ children, title }: CardProps) {
  const { colors } = useCustomTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rotateAnim = useRef(new Animated.Value(1)).current;

  const onCardToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isCollapsed ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [isCollapsed]);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.surface }]}>
      <PressableHaptic style={styles.header} onPress={onCardToggle}>
        <RNText style={styles.title}>{title}</RNText>
        <Animated.View style={[styles.iconDropdown, { transform: [{ rotate: rotate }] }]}>
          <SvgIcon name="arrowDown" size={16} />
        </Animated.View>
      </PressableHaptic>
      <Collapsible style={styles.content} collapsed={isCollapsed}>
        {children}
      </Collapsible>
    </View>
  );
}
export default memo(Card, isEqual);
