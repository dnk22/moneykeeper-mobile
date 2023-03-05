import { useNavigation, useRoute } from '@react-navigation/native';
import { RNText } from 'components/index';
import InputField from 'components/InputField';
import InputSelection from 'components/InputSelection';
import SvgIcon from 'components/SvgIcon';
import { UpdateTransactionCategoryRouteProps } from 'navigation/types';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useAppDispatch } from 'store/index';
import { addOrUpdateTransactionCategory } from 'store/transactions/transactions.slice';
import { TTransactionsCategory } from 'database/types/index';
import ParentList from './ParentList';
import styles from './styles';

function UpdateTransactionCategory() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { params } = useRoute<UpdateTransactionCategoryRouteProps>();
  const [isShowParentList, setIsShowParentList] = useState(false);

  const { control, handleSubmit, getValues, setValue } = useForm<TTransactionsCategory>({
    defaultValues: {
      id: '',
    },
  });

  useEffect(() => {
    setValue('category_type', params.transaction_category_type);
  }, [params.transaction_category_type]);

  const onToggleParentListModal = useCallback(() => {
    setIsShowParentList(!isShowParentList);
  }, [isShowParentList]);

  const onHandleSubmit = (data: TTransactionsCategory) => {
    dispatch(addOrUpdateTransactionCategory(data));
    navigation.goBack();
  };

  return (
    <View style={styles.form}>
      <ParentList isVisible={isShowParentList} onToggleModal={onToggleParentListModal} />
      <View style={styles.selectIcon}></View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <View style={styles.itemGroup}>
          <SvgIcon name="clipboard" style={styles.icon} />
          <View style={styles.groupContent}>
            <InputField
              name="category_name"
              control={control}
              placeholder="Tên danh mục"
              style={styles.formInput}
              clearButtonMode="always"
              maxLength={50}
              rules={{ required: true }}
            />
          </View>
        </View>
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" style={styles.icon} />
          <View style={styles.groupContent}>
            <InputField
              name="category_description"
              control={control}
              placeholder="Mô tả"
              style={styles.formInput}
              clearButtonMode="always"
              maxLength={50}
            />
          </View>
        </View>
      </View>
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <InputSelection icon="group" title="Chọn nhóm" onSelect={onToggleParentListModal} />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.group, styles.submit, { backgroundColor: colors.primary }]}
        onPress={handleSubmit(onHandleSubmit)}
      >
        <SvgIcon name="doneCircle" color="white" />
        <RNText color="white" style={{ marginLeft: 5 }}>
          Lưu
        </RNText>
      </TouchableOpacity>
    </View>
  );
}
export default UpdateTransactionCategory;
