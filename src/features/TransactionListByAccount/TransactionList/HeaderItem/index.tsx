import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { RNText } from 'components/index';
import isEqual from 'react-fast-compare';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { formatDateStringLocal } from 'utils/date';
import { isToday, isYesterday, parseISO } from 'date-fns';
import { ITEM_HEIGHT, MARGIN_TOP } from '../const';

type ItemProps = {
  item: string;
  itemLength: number;
};

function HeaderItem({ item, itemLength }: ItemProps) {
  const { colors } = useCustomTheme();

  const formatDate = useCallback((format: string) => formatDateStringLocal(item, format), [item]);

  const formatDayOfTheWeek = () => {
    if (isToday(parseISO(item))) {
      return 'Hôm nay';
    } else if (isYesterday(parseISO(item))) {
      return 'Hôm qua';
    }
    return formatDate('EEEE');
  };

  const parentLineHeight = useMemo(() => {
    return ITEM_HEIGHT * (itemLength - 1) + MARGIN_TOP * itemLength + ITEM_HEIGHT / 2;
  }, [itemLength]);

  return (
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
  );
}
export default memo(HeaderItem, isEqual);
