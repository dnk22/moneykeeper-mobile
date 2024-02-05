import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { isArray, size } from 'lodash';
import { formatNumber } from 'utils/math';
import { TRANSACTION_TYPE } from 'utils/constant';
import { ITEM_HEIGHT, MARGIN_TOP } from 'share/dimensions';
import { GroupedTransactionProps } from 'utils/types';
import { useAppSelector } from 'store/index';
import { selectTransactionListConfig } from 'store/app/app.selector';
import TransactionItem from '../TransactionItem';
import styles from './styles';

function HeaderItem({ transaction }: { transaction: GroupedTransactionProps }) {
  const { colors } = useCustomTheme();
  const { date, data = [] } = transaction;
  const display = useAppSelector((state) => selectTransactionListConfig(state));
  const formatDate = useCallback((format: string) => formatDateStringLocal(date, format), [date]);
  const transactionLength = size(data);

  const formatDayOfTheWeek = () => {
    if (isToday(parseISO(date))) {
      return 'Hôm nay';
    } else if (isYesterday(parseISO(date))) {
      return 'Hôm qua';
    }
    return formatDate('EEEE');
  };

  const parentLineHeight = useMemo(() => {
    return ITEM_HEIGHT * (transactionLength - 1) + MARGIN_TOP * transactionLength + ITEM_HEIGHT / 2;
  }, [transactionLength]);

  const getTotalMoneyInDay = (type: TRANSACTION_TYPE, show?: boolean) => {
    let total = 0;
    if (!show) {
      return total;
    }
    transaction.data
      .filter((item) => (type === TRANSACTION_TYPE.INCOME ? item.amount > 0 : item.amount < 0))
      .forEach((item) => {
        total += item.amount;
      });
    return total;
  };

  return (
    <>
      {/* <View style={[styles.statementSeparator, { backgroundColor: colors.primary }]}>
        <RNText color="#ffffff">haah</RNText>
        <RNText color="#ffffff">
          {formatNumber(getTotalMoneyInDay(TRANSACTION_TYPE.EXPENSE, display.expense), true)}
        </RNText>
      </View> */}
      <View style={styles.item}>
        {Boolean(transactionLength) && (
          <View
            style={[
              styles.parentLine,
              {
                height: parentLineHeight,
              },
            ]}
          />
        )}
        <View style={[styles.header, { backgroundColor: colors.surface, height: ITEM_HEIGHT }]}>
          <View>
            <RNText fontSize={30} style={styles.day}>
              {formatDate('dd')}
            </RNText>
          </View>
          <View>
            <RNText>{formatDayOfTheWeek()}</RNText>
            <RNText color="gray" fontSize={14}>
              {formatDate('MM/yyyy')}
            </RNText>
          </View>
          <View style={styles.dayExpense}>
            {!!getTotalMoneyInDay(TRANSACTION_TYPE.INCOME, display.income) && (
              <RNText color="green">
                {formatNumber(getTotalMoneyInDay(TRANSACTION_TYPE.INCOME, display.income), true)}
              </RNText>
            )}
            {!!getTotalMoneyInDay(TRANSACTION_TYPE.EXPENSE, display.expense) && (
              <RNText color="red">
                {formatNumber(getTotalMoneyInDay(TRANSACTION_TYPE.EXPENSE, display.expense), true)}
              </RNText>
            )}
          </View>
        </View>
        {isArray(data) &&
          data.map((item) => {
            return (
              <TransactionItem
                data={item}
                key={item.id}
                display={{ description: display.description, amount: display.amount }}
              />
            );
          })}
      </View>
    </>
  );
}

export default HeaderItem;
