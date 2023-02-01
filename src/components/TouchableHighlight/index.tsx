import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableHighlight, TouchableHighlightProps } from 'react-native';
import { useCustomTheme } from 'resources/theme';

function TouchableHighlightComponent({
  style,
  children,
  activeOpacity = 0.8,
  onPress,
}: TouchableHighlightProps) {
  const { colors } = useCustomTheme();
  return (
    <TouchableHighlight
      style={[{ borderRadius: 10 }, style]}
      onPress={onPress}
      underlayColor={colors.background}
      activeOpacity={activeOpacity}
    >
      {children}
    </TouchableHighlight>
  );
}

export default memo(TouchableHighlightComponent, isEqual);
