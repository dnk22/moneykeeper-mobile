import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { isArray, size } from 'lodash';
import { getTransactionByDate } from 'services/api/transactions';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';
import TransactionItem from '../TransactionItem';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

type HeaderItemProps = {
  date: string;
  accountId: string;
  accountObserve?: any;
};

function HeaderItem({ date, accountId }: HeaderItemProps) {
  const { colors } = useCustomTheme();
  const [transaction, setTransaction] = useState([]);
  const formatDate = useCallback((format: string) => formatDateStringLocal(date, format), [date]);
  const transactionLength = size(transaction);

  useFocusEffect(
    useCallback(() => {
      getTransactionByDate(accountId, date).then((res) => {
        setTransaction(res);
      });
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
            <RNText>Hôm nay</RNText>
            <RNText>Hôm nay</RNText>
          </View>
        </View>
      </View>
      {isArray(transaction) &&
        transaction.map((item) => {
          return <TransactionItem data={item} key={item.id} />;
        })}
    </>
  );
}

export default HeaderItem;
