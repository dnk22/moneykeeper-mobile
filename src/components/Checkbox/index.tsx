import React from 'react';
import { TouchableWithoutFeedback, View, Image, StyleProp, ViewStyle } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { styles } from './styles';

const checkbox_check = require('./icon/checkbox-check.png');
const checkbox_uncheck = require('./icon/checkbox-uncheck.png');
const radio_check = require('./icon/radio-check.png');
const radio_uncheck = require('./icon/radio-uncheck.png');

type CheckboxComponentProps = {
  style?: StyleProp<ViewStyle>;
  type?: 'checkbox' | 'radio';
  check?: boolean;
  size?: number;
  color?: string;
  onPress?: (check: boolean) => void;
  disabled?: boolean;
};

const CheckboxComponent = ({
  style,
  size = 20,
  type = 'radio',
  color = 'gray',
  check = false,
  disabled = false,
  onPress,
}: CheckboxComponentProps) => {
  const {
    colors: { primary },
  } = useCustomTheme();

  const imageSource =
    type === 'checkbox'
      ? check
        ? checkbox_check
        : checkbox_uncheck
      : check
      ? radio_check
      : radio_uncheck;

  const onClick = () => {
    if (disabled) return;
    if (onPress) {
      onPress(!check);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, style, { opacity: disabled ? 0.5 : 1 }]}>
        <Image
          style={{
            width: size,
            height: size,
            tintColor: color ?? (check ? primary : undefined),
          }}
          source={imageSource}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckboxComponent;
