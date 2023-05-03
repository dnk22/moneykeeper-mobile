import { memo, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { FlatListComponent, RNText } from 'components/index';
import isEqual from 'react-fast-compare';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';
import withObservables from '@nozbe/with-observables';
import { getTransactionsByDateObserve } from 'database/querying';
import { TransactionModel } from 'database/models';
import TransactionItem from '../TransactionItem';

type HeaderItemProps = {
  item: string;
  accountId: string;
  accountObserve?: any;
};

const TransactionObserve = memo(
  withObservables(['data'], ({ data }) => ({
    data: data.observe(),
  }))(TransactionItem),
  isEqual,
);

function HeaderItem({ item, accountObserve }: HeaderItemProps) {
  const { colors } = useCustomTheme();
  const formatDate = useCallback((format: string) => formatDateStringLocal(item, format), [item]);
  const itemLength = accountObserve.length;

  const formatDayOfTheWeek = () => {
    if (isToday(parseISO(item))) {
      return 'Hôm nay';
    } else if (isYesterday(parseISO(item))) {
      return 'Hôm qua';
    }
    return formatDate('EEEE');
  };

  function renderItem({ item }: { item: TransactionModel }) {
    return <TransactionObserve data={item} />;
  }

  const parentLineHeight = useMemo(() => {
    return ITEM_HEIGHT * (itemLength - 1) + MARGIN_TOP * itemLength + ITEM_HEIGHT / 2;
  }, [itemLength]);

  return (
    <>
      <View style={styles.item}>
        {Boolean(itemLength) && (
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
            <RNText>{formatDate('MM/yyyy')}</RNText>
          </View>
          <View style={styles.dayExpense}>
            <RNText>Hôm nay</RNText>
            <RNText>Hôm nay</RNText>
          </View>
        </View>
      </View>
      <FlatListComponent data={accountObserve} renderItem={renderItem} />
    </>
  );
}

export default withObservables(['accountObserve'], ({ item, accountId }: HeaderItemProps) => ({
  accountObserve: getTransactionsByDateObserve({ date: item, accountId }),
}))<any>(memo(HeaderItem, isEqual));
