import React from 'react';
import { TouchableWithoutFeedback, View, StyleProp, ViewStyle } from 'react-native';
import RnText from 'components/Text';
import { styles } from './styles';

type CheckboxComponentProps = {
  style?: StyleProp<ViewStyle>;
  checkbox?: boolean;
  check?: boolean;
  size?: number;
  color?: string;
  onPress?: (check: boolean) => void;
  disabled?: boolean;
};

const CheckboxComponent = ({
  style,
  size = 20,
  checkbox = false,
  color = 'green',
  check = false,
  disabled = false,
  onPress,
}: CheckboxComponentProps) => {
  const radioCenterSize = size - 8;
  const radioRadius = size / 2;

  const onClick = () => {
    if (disabled) return;
    if (onPress) {
      onPress(!check);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View
        style={[
          styles.container,
          style,
          {
            opacity: disabled ? 0.3 : 1,
            borderRadius: !checkbox ? radioRadius : 6,
            width: size,
            height: size,
          },
        ]}
      >
        {!checkbox ? (
          <View
            style={[
              styles.centerPoint,
              {
                backgroundColor: check ? color : 'transparent',
                width: radioCenterSize,
                height: radioCenterSize,
                borderRadius: radioRadius,
              },
            ]}
          />
        ) : (
          <>
            {check && (
              <RnText fontSize={size - 5} color={color} style={styles.text}>
                ✓
              </RnText>
            )}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckboxComponent;
