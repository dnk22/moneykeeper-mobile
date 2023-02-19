import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableHighlight, TouchableHighlightProps, View } from 'react-native';

type TouchableHighlightComponent = TouchableHighlightProps & {
  isActive?: boolean;
};
function TouchableHighlightComponent({
  style,
  isActive = true,
  children,
  activeOpacity = 0.8,
  onPress,
}: TouchableHighlightComponent) {
  return (
    <TouchableHighlight
      style={[{ borderRadius: 10 }, style]}
      onPress={isActive ? onPress : undefined}
      underlayColor={'rgba(50, 50, 50, 0.1)'}
      activeOpacity={activeOpacity}
    >
      <View style={{ opacity: isActive ? 1 : 0.5 }}>{children}</View>
    </TouchableHighlight>
  );
}

export default memo(TouchableHighlightComponent, isEqual);
