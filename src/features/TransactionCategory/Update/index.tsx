import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Submit, InputField, InputSelection, SvgIcon } from 'components/index';
import { UpdateTransactionCategoryRouteProps } from 'navigation/types';
import { useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactionsCategory } from 'database/types/index';
import {
  addTransactionCategory,
  getTransactionCategoryById,
} from 'database/querying/transactionsCategory.query';
import styles from './styles';
import { PARENT_LIST } from 'navigation/constants';
import { selectTabActive } from 'store/transactionCategory/transactionCategory.selector';
import { useAppSelector } from 'store/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';

function UpdateTransactionCategory() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const { params } = useRoute<UpdateTransactionCategoryRouteProps>();
  const isTabActive = useAppSelector((state) => selectTabActive(state));
  const [parentGroup, setParentGroup] = useState<TransactionCategoryModel | undefined>(undefined);

  const { control, handleSubmit, getValues, setValue } = useForm<TTransactionsCategory>({
    defaultValues: {
      isSystem: false,
      description: '',
    },
  });

  useEffect(() => {
    setValue('categoryType', isTabActive);
  }, [isTabActive]);

  useEffect(() => {
    if (params?.parentId) {
      setParentState(params.parentId);
    }
  }, [params?.parentId]);

  const setParentState = async (id: string) => {
    setValue('parentId', id);
    const res = await getTransactionCategoryById(id);
    setParentGroup(res);
  };

  const handleOnSelectParent = () => {
    navigation.navigate(PARENT_LIST);
  };

  const onHandleSubmit = (data: TTransactionsCategory) => {
    if (params?.transactionCategoryId) {
    } else {
      addTransactionCategory(data);
    }
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.form}>
        <View style={styles.selectIcon}></View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="clipboard" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="categoryName"
                control={control}
                placeholder="Tên danh mục"
                style={styles.formInput}
                maxLength={50}
                rules={{ required: true }}
                autoFocus
              />
            </View>
          </View>
          <View style={styles.itemGroup}>
            <SvgIcon name="textWord" style={styles.icon} />
            <View style={styles.groupContent}>
              <InputField
                name="description"
                control={control}
                placeholder="Mô tả"
                style={styles.formInput}
                maxLength={50}
              />
            </View>
          </View>
        </View>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <InputSelection
            title="Chọn nhóm"
            icon={parentGroup?.icon || 'group'}
            value={parentGroup?.categoryName}
            onSelect={handleOnSelectParent}
          />
        </View>
        <Submit onPress={handleSubmit(onHandleSubmit)} />
      </View>
    </TouchableWithoutFeedback>
  );
}
export default UpdateTransactionCategory;
