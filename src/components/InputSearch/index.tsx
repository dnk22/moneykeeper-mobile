import { memo } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import { SearchNormal1 } from 'iconsax-react-native';
import styles from './styles';

type InputSearch = TextInputProps & {
  backgroundColor?: string;
};
function InputSearch({
  placeholder = 'Tìm kiếm...',
  onChangeText,
  backgroundColor,
  style,
  ...rest
}: InputSearch) {
  const { colors } = useCustomTheme();
  return (
    <View
      style={[styles.inputGroup, style, { backgroundColor: backgroundColor || colors.surface }]}
    >
      <TextInput
        placeholder={placeholder}
        style={[styles.inputSearch, { color: colors.text }]}
        onChangeText={onChangeText}
        {...rest}
      />
      <SearchNormal1 size="18" color="gray" style={styles.iconSearch} />
    </View>
  );
}
export default memo(InputSearch, isEqual);
