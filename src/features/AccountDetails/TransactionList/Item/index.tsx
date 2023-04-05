import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { RNText, VirtualizedListComponent } from 'components/index';
import isEqual from 'react-fast-compare';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { AccountStackParamListProps } from 'navigation/types';
import { useRoute } from '@react-navigation/native';
import { getTransactionByDate } from 'database/querying';
import { TransactionModel } from 'database/models';
import Record from '../Record';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';

type ItemProps = {
  item: { dateTimeAt: string };
};

function Item({ item }: ItemProps) {
  const { colors } = useCustomTheme();
  const { params } = useRoute<AccountStackParamListProps<'accountDetail'>['route']>();
  const [data, setData] = useState<TransactionModel[]>([]);

  useEffect(() => {
    fetchTransactionByDate();
  }, []);

  const fetchTransactionByDate = async () => {
    const res = await getTransactionByDate({
      accountId: params.accountId,
      date: item.dateTimeAt,
    });
    setData(res);
  };

  const formatDate = useCallback(
    (format: string) => formatDateStringLocal(item.dateTimeAt, format),
    [item.dateTimeAt],
  );

  const formatDayOfTheWeek = () => {
    if (isToday(parseISO(item.dateTimeAt))) {
      return 'Hôm nay';
    } else if (isYesterday(parseISO(item.dateTimeAt))) {
      return 'Hôm qua';
    }
    return formatDate('EEEE');
  };

  const renderItem = useCallback(({ item }: { item: TransactionModel }) => {
    return <Record item={item} colors={colors} />;
  }, []);

  const parentLineHeight = useMemo(() => {
    return ITEM_HEIGHT * (data.length - 1) + MARGIN_TOP * data.length + ITEM_HEIGHT / 2;
  }, [data]);

  return (
    <View style={styles.item}>
      {Boolean(data.length) && (
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
      <View style={styles.recordView}>
        <VirtualizedListComponent data={data} renderItem={renderItem} />
      </View>
    </View>
  );
}
export default memo(Item, isEqual);
