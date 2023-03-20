import { memo } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import isEqual from 'react-fast-compare';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

function Submit({ onPress }: TouchableOpacityProps) {
  const { colors } = useCustomTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <SvgIcon name="doneCircle" color="white" />
      <RNText color="white" style={{ marginLeft: 5 }}>
        Lưu
      </RNText>
    </TouchableOpacity>
  );
}
export default memo(Submit, isEqual);
