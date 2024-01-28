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
import TransactionItem from '../TransactionItem';
import styles from './styles';

type HeaderItemProps = {
  transaction: GroupedTransactionProps;
  accountId: string;
};

function HeaderItem({ transaction, accountId }: HeaderItemProps) {
  const { colors } = useCustomTheme();
  const { date, data = [] } = transaction;
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

  const getTotalMoneyInDay = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    data.forEach((item) => {
      if (item.transactionType === TRANSACTION_TYPE.INCOME) {
        totalIncome += item.amount;
      }
      if (item.transactionType === TRANSACTION_TYPE.EXPENSE) {
        totalExpense += -item.amount;
      }
      if (item.transactionType === TRANSACTION_TYPE.TRANSFER) {
        if (item.toAccountId === accountId) {
          totalIncome += item.amount;
        } else {
          totalExpense += -item.amount;
        }
      }
    });
    return { totalIncome, totalExpense };
  }, [data]);

  return (
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
          {!!getTotalMoneyInDay.totalIncome && (
            <RNText color="green">{formatNumber(getTotalMoneyInDay.totalIncome, true)}</RNText>
          )}
          {!!getTotalMoneyInDay.totalExpense && (
            <RNText color="red">{formatNumber(getTotalMoneyInDay.totalExpense, true)}</RNText>
          )}
        </View>
      </View>
      {isArray(data) &&
        data.map((item) => {
          return <TransactionItem data={item} key={item.id} />;
        })}
    </View>
  );
}

export default HeaderItem;
