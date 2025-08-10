import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import PressableHaptic from 'components/PressableHaptic';
import FormAction from 'components/common/FormAction';
import ImageComponent from 'components/ImageComponent';
import InputField from 'components/InputField';
import InputSelection from 'components/InputSelection';
import { TransactionCategoryParamProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import { FormProvider, useWatch } from 'react-hook-form';
import { Autobrightness, CloseCircle, Stickynote } from 'iconsax-react-native';
import useHook from './hook';
import styles from './styles';

function UpdateTransactionCategory({
  route,
  navigation,
}: {
  route: TransactionCategoryParamProps<typeof ROUTES.UPDATE_TRANSACTION_CATEGORY>['route'];
  navigation: TransactionCategoryParamProps<
    typeof ROUTES.UPDATE_TRANSACTION_CATEGORY
  >['navigation'];
}) {
  const { colors } = useCustomTheme();

  const {
    parentGroup,
    formMethods,
    handleSubmit,
    handleOnSelectParent,
    handleOnDeleteRecord,
    handleOnDeleteParent,
    handleOnDeleteIcon,
    onFormSubmit,
  } = useHook({
    route,
    navigation,
  });
  const iconValue = useWatch({ control: formMethods.control, name: 'icon' });
  const parentId = useWatch({ control: formMethods.control, name: 'parentId' });
  const isShowParent = !route.params?.transactionCategoryId || parentId;

  return (
    <FormProvider {...formMethods}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.form}>
          <PressableHaptic
            style={[
              styles.selectIcon,
              { backgroundColor: colors.surface, borderColor: colors.primary },
            ]}
            onPress={() => navigation.navigate(ROUTES.ICON_SELECT)}
          >
            <ImageComponent size={38} name={iconValue || 'unknown'} />
            {iconValue && (
              <PressableHaptic onPress={handleOnDeleteIcon} style={styles.clearIcon}>
                <CloseCircle color={colors.error} variant="Bold" />
              </PressableHaptic>
            )}
          </PressableHaptic>
          <View style={[styles.group, { backgroundColor: colors.surface }]}>
            <View style={styles.itemGroup}>
              <Autobrightness size="28" color={colors.text} style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="categoryName"
                  placeholder="Tên danh mục"
                  style={styles.formInput}
                  maxLength={50}
                  rules={{ required: true }}
                  autoFocus
                />
              </View>
            </View>
            <View style={styles.itemGroup}>
              <Stickynote size="28" color={colors.text} style={styles.icon} />
              <View style={styles.groupContent}>
                <InputField
                  name="description"
                  placeholder="Mô tả"
                  style={styles.formInput}
                  maxLength={50}
                />
              </View>
            </View>
          </View>
          {isShowParent && (
            <View style={[styles.group, { backgroundColor: colors.surface }]}>
              <InputSelection
                placeholder="Chọn nhóm"
                iconName={parentGroup?.icon}
                displayValue={parentGroup?.categoryName}
                onSelect={handleOnSelectParent}
                onDelete={handleOnDeleteParent}
              />
            </View>
          )}
          <FormAction
            isShowDelete={Boolean(route.params?.transactionCategoryId)}
            onSubmit={handleSubmit(onFormSubmit)}
            onDelete={handleOnDeleteRecord}
          />
        </View>
      </TouchableWithoutFeedback>
    </FormProvider>
  );
}
export default UpdateTransactionCategory;
