import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { InputSearch, RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

function ExpenseCategory() {
  const { colors } = useCustomTheme();
  const handleOnSearch = () => {};
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <InputSearch
          placeholder="Nhập tên"
          onChangeText={handleOnSearch}
          backgroundColor={colors.surface}
        />
        <View style={[styles.group, styles.mostRecent, { backgroundColor: colors.surface }]}>
          <RNText preset="subTitle">Dùng gần đây</RNText>
        </View>
        <View style={[styles.group, styles.itemCategory, { backgroundColor: colors.surface }]}>
          <RNText preset="subTitle">Dùng gần đây</RNText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ExpenseCategory;
