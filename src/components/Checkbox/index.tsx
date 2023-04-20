import React, { useEffect, useState } from 'react';
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
  color,
  check = false,
  disabled = false,
  onPress,
}: CheckboxComponentProps) => {
  const {
    colors: { primary },
  } = useCustomTheme();
  const [value, setValue] = useState<boolean>(check);

  useEffect(() => {
    setValue(check);
  }, [check]);

  const onClick = () => {
    if (disabled) return;
    setValue(!value);
    if (onPress) {
      onPress(!value);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, style]}>
        <Image
          style={{
            width: size,
            height: size,
            tintColor: color || primary,
          }}
          source={
            type === 'checkbox'
              ? value
                ? checkbox_check
                : checkbox_uncheck
              : value
              ? radio_check
              : radio_uncheck
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckboxComponent;
