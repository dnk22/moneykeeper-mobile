import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InputField, InputSelection, SvgIcon, PressableHaptic, FormAction } from 'components/index';
import { TransactionCategoryParamProps } from 'navigation/types';
import { useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TTransactionsCategory } from 'database/types/index';
import {
  addTransactionCategory,
  deleteTransactionCategoryById,
  getTransactionCategoryById,
  updateTransactionCategory,
} from 'database/querying/transactionsCategory.query';
import { ICON_SELECT, PARENT_LIST, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { selectTabActive } from 'store/transactionCategory/transactionCategory.selector';
import { useAppSelector } from 'store/index';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import styles from './styles';

function UpdateTransactionCategory() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof PARENT_LIST>['navigation']>();
  const { params } =
    useRoute<TransactionCategoryParamProps<typeof UPDATE_TRANSACTION_CATEGORY>['route']>();
  const isTabActive = useAppSelector((state) => selectTabActive(state));
  const [parentGroup, setParentGroup] = useState<TransactionCategoryModel | undefined>(undefined);

  const { control, handleSubmit, reset, setValue, watch, getValues } =
    useForm<TTransactionsCategory>({
      defaultValues: {
        isSystem: false,
        useCount: 0,
        parentId: null,
      },
    });

  useEffect(() => {
    setValue('icon', params?.icon);
  }, [params?.icon]);

  useEffect(() => {
    fetchDataInEditMode(params?.transactionCategoryId);
  }, [params?.transactionCategoryId]);

  useEffect(() => {
    setValue('categoryType', isTabActive);
  }, [isTabActive]);

  useEffect(() => {
    if (params?.parentId) {
      setValue('parentId', params.parentId);
    }
  }, [params?.parentId]);

  useEffect(() => {
    setParentState(getValues('parentId'));
  }, [watch('parentId')]);

  const fetchDataInEditMode = async (id?: string) => {
    if (!id) return;
    const res = await getTransactionCategoryById(id);
    if (res?.id) {
      let result = {
        categoryName: res.categoryName,
        categoryType: res.categoryType,
        description: res.description,
        parentId: res.parentId,
        icon: res.icon,
        useCount: res.useCount,
      };
      reset(result);
    }
  };

  const setParentState = async (id: any) => {
    if (!id) return;
    setValue('parentId', id);
    const res = await getTransactionCategoryById(id);
    setParentGroup(res);
  };

  const handleOnSelectParent = () => {
    navigation.navigate(PARENT_LIST, {
      type: isTabActive,
    });
  };

  const handleOnDeleteRecord = async () => {
    if (params?.transactionCategoryId) {
      deleteTransactionCategoryById(params.transactionCategoryId).then(({ status }) => {
        if (status) {
          navigation.goBack();
        }
      });
    }
  };

  const handleOnDeleteParent = () => {
    setValue('parentId', null);
    setParentGroup(undefined);
  };

  const handleOnDeleteIcon = () => {
    setValue('icon', undefined);
  };

  const navigateToSelectIcon = () => {
    navigation.navigate(ICON_SELECT);
  };

  const onHandleSubmit = (data: TTransactionsCategory) => {
    if (params?.transactionCategoryId) {
      updateTransactionCategory({ id: params?.transactionCategoryId, data });
    } else {
      addTransactionCategory(data);
    }
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.form}>
        <PressableHaptic
          style={[
            styles.selectIcon,
            { backgroundColor: colors.surface, borderColor: colors.primary },
          ]}
          onPress={navigateToSelectIcon}
        >
          <SvgIcon size={30} name={watch('icon')} />
          {watch('icon') && (
            <PressableHaptic onPress={handleOnDeleteIcon} style={styles.clearIcon}>
              <SvgIcon size={18} name="closeCircle" color="red" />
            </PressableHaptic>
          )}
        </PressableHaptic>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={styles.itemGroup}>
            <SvgIcon name="clipboard" opacity={0.7} />
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
            <SvgIcon name="textWord" opacity={0.7} />
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
            onDelete={handleOnDeleteParent}
          />
        </View>
        <FormAction
          isShowDelete={Boolean(params?.transactionCategoryId)}
          onSubmit={handleSubmit(onHandleSubmit)}
          onDelete={handleOnDeleteRecord}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
export default UpdateTransactionCategory;
