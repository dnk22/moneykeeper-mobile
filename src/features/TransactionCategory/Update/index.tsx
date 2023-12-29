import React, { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { InputField, InputSelection, SvgIcon, PressableHaptic, FormAction } from 'components/index';
import { TransactionCategoryParamProps } from 'navigation/types';
import { useForm } from 'react-hook-form';
import { useCustomTheme } from 'resources/theme';
import { TTransactionsCategory } from 'database/types';
import { ICON_SELECT, PARENT_LIST, UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import TransactionCategoryModel from 'database/models/transactionCategory.model';
import {
  deleteTransactionCategoryByID,
  getTransactionCategoryByID,
  updateTransactionCategory,
} from 'services/api/transactionsCategory';
import styles from './styles';

function UpdateTransactionCategory() {
  const { colors } = useCustomTheme();
  const navigation =
    useNavigation<TransactionCategoryParamProps<typeof PARENT_LIST>['navigation']>();
  const { params } =
    useRoute<TransactionCategoryParamProps<typeof UPDATE_TRANSACTION_CATEGORY>['route']>();
  const [parentGroup, setParentGroup] = useState<TransactionCategoryModel | undefined>(undefined);
  const [isShowSelectParent, setIsShowSelectParent] = useState(true);

  const { control, handleSubmit, reset, setValue, watch, getValues } =
    useForm<TTransactionsCategory>({
      defaultValues: {
        isSystem: false,
        useCount: 0,
        parentId: '',
      },
    });

  useEffect(() => {
    if (params?.icon) {
      setValue('icon', params.icon);
    }
  }, [params?.icon]);

  useEffect(() => {
    fetchDataInEditMode(params?.transactionCategoryId);
  }, [params?.transactionCategoryId]);

  useEffect(() => {
    setValue('categoryType', params?.type);
  }, [params?.type]);

  useEffect(() => {
    if (params?.parentId) {
      setValue('parentId', params.parentId);
    }
  }, [params?.parentId]);

  useEffect(() => {
    if (getValues('parentId')) {
      setParentState(getValues('parentId'));
    }
  }, [watch('parentId')]);

  const fetchDataInEditMode = async (id?: string) => {
    if (!id) return;
    const res = await getTransactionCategoryByID(id);
    if (res?.id) {
      setIsShowSelectParent(res.parentId);
      reset(res);
    }
  };

  const setParentState = async (id: any) => {
    if (!id) return;
    setValue('parentId', id);
    const res = await getTransactionCategoryByID(id);
    setParentGroup(res);
  };

  const handleOnSelectParent = () => {
    navigation.navigate(PARENT_LIST, {
      type: params?.type || getValues('categoryType'),
    });
  };

  const handleOnDeleteRecord = async () => {
    if (params?.transactionCategoryId) {
      deleteTransactionCategoryByID(params.transactionCategoryId).then(({ status }) => {
        if (status) {
          navigation.goBack();
        }
      });
    }
  };

  const handleOnDeleteParent = () => {
    setValue('parentId', '');
    setParentGroup(undefined);
  };

  const handleOnDeleteIcon = () => {
    setValue('icon', '');
  };

  const navigateToSelectIcon = () => {
    navigation.navigate(ICON_SELECT);
  };

  const onHandleSubmit = (data: TTransactionsCategory) => {
    delete data.id;
    updateTransactionCategory({ id: params.transactionCategoryId, data });
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
        {isShowSelectParent && (
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <InputSelection
              title="Chọn nhóm"
              icon={parentGroup?.icon || 'group'}
              value={parentGroup?.categoryName}
              onSelect={handleOnSelectParent}
              onDelete={handleOnDeleteParent}
            />
          </View>
        )}
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
