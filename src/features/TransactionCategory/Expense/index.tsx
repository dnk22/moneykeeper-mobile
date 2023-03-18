import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { InputSearch, PressableHaptic, RNText, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { TRANSACTION_CATEGORY_TYPE } from 'utils/data';
import { UpdateTransactionCategoryProps } from 'navigation/types';

function ExpenseCategory() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<UpdateTransactionCategoryProps>();
  

  const handleOnSearch = () => {};

  const handleOnNavigateToScreenAdd = () => {
    navigation.navigate(UPDATE_TRANSACTION_CATEGORY, {
      transaction_category_type: TRANSACTION_CATEGORY_TYPE.EXPENSE,
    });
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <PressableHaptic
          style={[styles.addIcon, { backgroundColor: colors.primary }]}
          onPress={handleOnNavigateToScreenAdd}
        >
          <SvgIcon name="add" color="white" />
        </PressableHaptic>
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
