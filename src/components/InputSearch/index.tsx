import { memo } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import isEqual from 'react-fast-compare';
import SvgIcon from 'components/SvgIcon';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

type InputSearch = TextInputProps & {
  backgroundColor?: string;
};
function InputSearch({ placeholder = 'Tìm kiếm...', onChangeText, backgroundColor }: InputSearch) {
  const { colors } = useCustomTheme();
  return (
    <View style={[styles.inputGroup, { backgroundColor: backgroundColor || colors.surface }]}>
      <TextInput
        placeholder={placeholder}
        style={[styles.inputSearch, { color: colors.text }]}
        onChangeText={onChangeText}
      />
      <SvgIcon name="search" style={styles.iconSearch} size={18} color="gray" />
    </View>
  );
}
export default memo(InputSearch, isEqual);
