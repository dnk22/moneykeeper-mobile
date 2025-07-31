import { memo } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
import CategorySelect from '../components/CategorySelect';
import DateTimeSelect from '../components/DateTimeSelect';
import MoreDetail from '../components/MoreDetail';
import AccountSelect from '../components/AccountSelect';
import RelatedPersonSelect from '../components/RelatedPersonSelect';
import Fee from '../components/Fee';
import { AddTransactionType } from '../type';
import InputField from 'components/InputField';
import SvgIcon from 'components/SvgIcon';
import SwitchField from 'components/Switch/SwitchField';
import FormAction from 'components/common/FormAction';
import RNText from 'components/Text';
import styles from '../styles';
import InputCalculator from 'components/InputCalculator';
import isEqual from 'react-fast-compare';
import useExpenseIncomeHook from '../hooks/useExpenseIncomeLogic';

function ExpenseAndIncome({ params, onSubmitSuccess }: AddTransactionType) {
  const { colors } = useCustomTheme();

  const {
    categoryId,
    lendBorrowData,
    recordAt,
    isLendBorrowType,
    inputAmountColor,
    transactionType,
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

  const isExpenseType = transactionType === TRANSACTION_TYPE.EXPENSE;

  return (
    <>
      <InputCalculator name="amount" inputTextColor={'green'} autoFocus />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <CategorySelect onPress={handleOnCategorySelect} />
        {isLendBorrowType && categoryId && (
          <RelatedPersonSelect
            required
            fieldName="relatedPerson"
            title={
              [
                TRANSACTION_LEND_BORROW_NAME.BORROW,
                TRANSACTION_LEND_BORROW_NAME.REPAYMENT,
              ].includes(lendBorrowData[categoryId])
                ? 'Người cho vay'
                : 'Người vay'
            }
          />
        )}
        <View style={styles.itemGroup}>
          <SvgIcon name="textWord" color={styles.iconShadow.color} />
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
                <SvgIcon name="camp" color={styles.iconShadow.color} />
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
            <SvgIcon name="map" color={styles.iconShadow.color} />
            <View style={styles.groupContent}>
              <InputField
                name="location"
                placeholder="Địa điểm"
                style={[styles.formInput, { width: '90%' }]}
                maxLength={50}
              />
              <SvgIcon name="location" size={18} style={styles.iconForward} />
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
