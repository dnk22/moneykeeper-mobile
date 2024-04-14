import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { isArray, isEmpty, isEqual as isEqualLodash, size } from 'lodash';
import { getTransactionByDate } from 'services/api/transactions';
import { useFocusEffect } from '@react-navigation/native';
import { formatNumber } from 'utils/math';
import { TTransactions } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constant';
import {
  PARENT_ITEM_TRANSACTION_HEIGHT,
  MARGIN_TOP,
  CHILD_ITEM_TRANSACTION_HEIGHT,
} from 'share/dimensions';
import { useAppSelector } from 'store/index';
import { selectTransactionListConfig } from 'store/app/app.selector';
import TransactionItem from '../TransactionItem';
import styles from './styles';

type HeaderItemProps = {
  date: string;
  accountId: string;
  accountObserve?: any;
  onRefreshDate: () => void;
  reload: number;
};

function HeaderItem({ date, accountId, onRefreshDate, reload }: HeaderItemProps) {
  const { colors } = useCustomTheme();
  const [transaction, setTransaction] = useState<TTransactions[] | any[]>([]);
  const display = useAppSelector((state) => selectTransactionListConfig(state));
  const formatDate = useCallback((format: string) => formatDateStringLocal(date, format), [date]);
  const transactionLength = size(transaction);

  const fetchTransactionInDay = () => {
    getTransactionByDate(accountId, date).then((res) => {
      if (!isArray(res) || isEqualLodash(res, transaction)) {
        return;
      }
      if (isEmpty(res)) {
        onRefreshDate();
      }
      setTransaction(res);
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactionInDay();
    }, [reload]),
  );

  const formatDayOfTheWeek = () => {
    if (isToday(parseISO(date))) {
      return 'Hôm nay';
    } else if (isYesterday(parseISO(date))) {
      return 'Hôm qua';
    }
    return formatDate('EEEE');
  };

  const parentLineHeight = useMemo(
    () =>
      CHILD_ITEM_TRANSACTION_HEIGHT * (transactionLength - 1) +
      MARGIN_TOP * (transactionLength + 1) +
      CHILD_ITEM_TRANSACTION_HEIGHT / 2,
    [transactionLength],
  );

  const getTotalMoneyInDay = (type: TRANSACTION_TYPE, show?: boolean) => {
    let total = 0;
    if (!show) {
      return total;
    }
    transaction
      .filter((item) => (type === TRANSACTION_TYPE.INCOME ? item.amount > 0 : item.amount < 0))
      .forEach((item) => {
        total += item.amount;
      });
    return total;
  };

  return (
    <>
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              height: PARENT_ITEM_TRANSACTION_HEIGHT,
            },
          ]}
        >
          <RNText fontSize={30} style={styles.day}>
            {formatDate('dd')}
          </RNText>
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
      </View>
      {isArray(transaction) &&
        transaction.map((item) => {
          return (
            <TransactionItem
              data={item}
              key={item.id}
              display={{ description: display.description, amount: display.amount }}
            />
          );
        })}
    </>
  );
}

export default HeaderItem;
