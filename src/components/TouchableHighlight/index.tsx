import { TouchableHighlight, TouchableHighlightProps } from 'react-native';
import { useCustomTheme } from 'resources/theme';

type TouchableHighlightComponent = TouchableHighlightProps & {
  isDisable?: boolean;
};
function TouchableHighlightComponent({
  style,
  isDisable = false,
  children,
  activeOpacity = 0.7,
  onPress,
  underlayColor,
  ...rest
}: TouchableHighlightComponent) {
  const { colors } = useCustomTheme();
  return (
    <TouchableHighlight
      style={[{ borderRadius: 10 }, { opacity: isDisable ? 0.5 : 1 }, style]}
      onPress={!isDisable ? onPress : undefined}
      underlayColor={underlayColor || colors.background}
      activeOpacity={activeOpacity}
      {...rest}
    >
      {children}
    </TouchableHighlight>
  );
}

export default TouchableHighlightComponent;
