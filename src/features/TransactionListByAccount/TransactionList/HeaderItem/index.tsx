import React, { memo, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { isArray, isEmpty, isEqual as isEqualLodash, size } from 'lodash';
import { getTransactionByDate } from 'services/api/transactions';
import { useFocusEffect } from '@react-navigation/native';
import isEqual from 'react-fast-compare';
import { formatNumber } from 'utils/math';
import { TTransactions } from 'database/types';
import { TRANSACTION_TYPE } from 'utils/constant';
import { ITEM_HEIGHT, MARGIN_TOP } from 'share/dimensions';
import TransactionItem from '../TransactionItem';
import styles from './styles';

type HeaderItemProps = {
  date: string;
  accountId: string;
  accountObserve?: any;
  onRefreshDate: () => void;
};

function HeaderItem({ date, accountId, onRefreshDate }: HeaderItemProps) {
  const { colors } = useCustomTheme();
  const [transaction, setTransaction] = useState<TTransactions[] | any[]>([]);
  const formatDate = useCallback((format: string) => formatDateStringLocal(date, format), [date]);
  const transactionLength = size(transaction);

  const fetchTransactionInDay = useCallback(() => {
    getTransactionByDate(accountId, date).then((res) => {
      if (!isArray(res) || isEqualLodash(res, transaction)) {
        return;
      }
      if (isEmpty(res)) {
        onRefreshDate();
      }
      setTransaction(res);
    });
  }, [onRefreshDate, useCallback, date]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactionInDay();
    }, []),
  );

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

  const getTotalMoneyInDay = (itemKey: TRANSACTION_TYPE[]) => {
    return transaction.reduce((prevItem, currentItem) => {
      if (itemKey.includes(currentItem.transactionType)) {
        return (prevItem += currentItem.amount || 0);
      }
      return prevItem;
    }, 0);
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
            {!!getTotalMoneyInDay([TRANSACTION_TYPE.INCOME]) && (
              <RNText color="green">
                {formatNumber(getTotalMoneyInDay([TRANSACTION_TYPE.INCOME]), true)}
              </RNText>
            )}
            {!!getTotalMoneyInDay([TRANSACTION_TYPE.EXPENSE]) && (
              <RNText color="red">
                {formatNumber(getTotalMoneyInDay([TRANSACTION_TYPE.EXPENSE]), true)}
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
              onRefreshTransactionList={fetchTransactionInDay}
            />
          );
        })}
    </>
  );
}

export default memo(HeaderItem, isEqual);
