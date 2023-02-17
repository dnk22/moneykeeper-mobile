import { memo } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SvgIcon from 'components/SvgIcon';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

function InputSearch({ placeholder, onChangeText }: TextInputProps) {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.inputGroup}>
      <TextInput
        placeholder={placeholder}
        style={[styles.inputSearch, { backgroundColor: colors.background, color: colors.text }]}
        onChangeText={onChangeText}
      />
      <SvgIcon name="search" style={styles.iconSearch} size={18} color="gray" />
    </View>
  );
}
export default memo(InputSearch, isEqual);
