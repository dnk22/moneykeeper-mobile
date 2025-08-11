import { memo } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import InputField from 'components/InputField';
import SvgIcon from 'components/SvgIcon';
import SwitchField from 'components/Switch/SwitchField';
import FormAction from 'components/common/FormAction';
import RNText from 'components/Text';
import InputCalculator from 'components/InputCalculator';
import isEqual from 'react-fast-compare';
import CategorySelect from '../components/CategorySelect';
import DateTimeSelect from '../components/DateTimeSelect';
import MoreDetail from '../components/MoreDetail';
import AccountSelect from '../components/AccountSelect';
import RelatedPersonSelect from '../components/RelatedPersonSelect';
import Fee from '../components/Fee';
import { AddTransactionType } from '../type';
import useExpenseIncomeHook from '../hooks/useExpenseIncomeLogic';
import styles from '../styles';
import { QuoteDownSquare, Map, Stickynote, DirectUp } from 'iconsax-react-native';

function ExpenseAndIncome({ params, onSubmitSuccess }: AddTransactionType) {
  const { colors } = useCustomTheme();

  const {
    categoryId,
    recordAt,
    isLendBorrowType,
    inputAmountColor,
    isExpenseType,
    relatedPersonPlaceholder,
    handleOnCategorySelect,
    handleOnDateTimePicker,
    onFeeRemove,
    onDeleteTransaction,
    handleSubmit,
    onSubmit,
  } = useExpenseIncomeHook({
    onSubmitSuccess,
    params,
  });

  return (
    <>
      <InputCalculator name="amount" inputTextColor={inputAmountColor} autoFocus />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <CategorySelect onPress={handleOnCategorySelect} />
        {isLendBorrowType && categoryId && (
          <RelatedPersonSelect
            required
            fieldName="relatedPerson"
            title={relatedPersonPlaceholder}
          />
        )}
        <View style={styles.itemGroup}>
          <Stickynote size="28" color={colors.text} style={styles.iconShadow} />
          <View style={styles.groupContent}>
            <InputField
              name="descriptions"
              placeholder="Chi tiết"
              style={styles.formInput}
              maxLength={50}
            />
          </View>
        </View>
        <DateTimeSelect values={recordAt} onChangeDate={handleOnDateTimePicker} />
        <AccountSelect />
      </View>
      <MoreDetail>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {!isLendBorrowType && (
            <>
              <RelatedPersonSelect
                fieldName={isExpenseType ? 'giver' : 'payee'}
                title={isExpenseType ? 'Chi cho ai' : 'Nhận từ ai'}
              />
              <View style={styles.itemGroup}>
                <QuoteDownSquare size="28" color={colors.text} style={styles.iconShadow} />
                <View style={styles.groupContent}>
                  <InputField
                    name="eventName"
                    placeholder="Sự kiện"
                    style={styles.formInput}
                    maxLength={50}
                  />
                </View>
              </View>
            </>
          )}
          <View style={styles.itemGroup}>
            <Map size="28" color={colors.text} style={styles.iconShadow} />
            <View style={styles.groupContent}>
              <InputField
                name="location"
                placeholder="Địa điểm"
                style={[styles.formInput, { width: '90%' }]}
                maxLength={50}
              />
              <DirectUp size="28" color={colors.primary} />
            </View>
          </View>
        </View>
        <Fee onClose={onFeeRemove}>
          <InputCalculator name="fee" />
        </Fee>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <View style={[styles.itemGroup, styles.itemGroupBetween]}>
            <RNText>Không tính vào báo cáo</RNText>
            <SwitchField name="excludeReport" />
          </View>
          <RNText preset="subTitle">Ghi chép này sẽ không thống kê vào các báo cáo.</RNText>
        </View>
      </MoreDetail>
      <FormAction
        isShowDelete={Boolean(params?.transactionId)}
        onDelete={onDeleteTransaction}
        onSubmit={handleSubmit(onSubmit)}
      />
      <View style={{ height: 150 }} />
    </>
  );
}

export default memo(ExpenseAndIncome, isEqual);
