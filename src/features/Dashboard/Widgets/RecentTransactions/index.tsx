import { memo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import ImageComponent from 'components/ImageComponent';
import { transactionLocalQuery } from 'database/querying';
import { TTransactions } from 'database/types';
import { isToday, isYesterday } from 'date-fns';
import { formatDateLocal } from 'utils/date';
import { formatNumber } from 'utils/math';
import { TRANSACTION_TYPE } from 'utils/constants';
import { styles } from './styles';

function RecentTransactions({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const [transactionList, setTransactionList] = useState<TTransactions[]>([]);

  useFocusEffect(
    useCallback(() => {
      transactionLocalQuery.getRecentTransactions(4).then((res) => {
        setTransactionList(res);
      });
    }, []),
  );

  const formatTransactionDate = (date: number) => {
    if (isToday(date)) {
      return 'Hôm nay';
    } else if (isYesterday(date)) {
      return 'Hôm qua';
    }
    return formatDateLocal(date, 'EEEE');
  };

  const renderCategoryName = (
    type: TRANSACTION_TYPE,
    categoryName?: string,
    amount: number,
    accountName?: string,
  ) => {
    switch (type) {
      case TRANSACTION_TYPE.TRANSFER:
        return `Chuyển khoản ${amount >= 0 ? 'từ' : 'tới'} ${accountName}`;
      case TRANSACTION_TYPE.ADJUSTMENT:
        return 'Cân bằng số dư';
      default:
        return categoryName;
    }
  };

  const renderCategoryIcon = (type: TRANSACTION_TYPE, icon: string, amount: number) => {
    switch (type) {
      case TRANSACTION_TYPE.TRANSFER:
        return amount >= 0 ? 'transferDown' : 'transferUp';
      default:
        return icon;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText preset="widgetTitle">{title}</RNText>
        <RNText preset="widgetViewMore">Xem tất cả</RNText>
      </View>
      {!transactionList.length && (
        <View
          style={[
            styles.emptyView,
            {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <RNText color="red">Chưa có ghi chép nào gần đây</RNText>
        </View>
      )}
      {transactionList &&
        transactionList.length > 0 &&
        transactionList.map((item) => {
          return (
            <View style={[styles.item, { backgroundColor: colors.surface }]} key={item.id}>
              <View style={styles.itemContent}>
                <View style={[styles.icon, { backgroundColor: colors.background }]}>
                  <ImageComponent
                    name={renderCategoryIcon(item.transactionType, item.categoryIcon, item.amount)}
                  />
                </View>
                <View style={styles.rowGap}>
                  <RNText style={styles.itemCategory}>
                    {renderCategoryName(
                      item.transactionType,
                      item.categoryName,
                      item.amount,
                      item.accountName,
                    )}
                  </RNText>
                  {item.descriptions && (
                    <RNText numberOfLines={1} preset="subTitle">
                      {item.descriptions}
                    </RNText>
                  )}
                </View>
              </View>
              <View style={[styles.itemDateTime, styles.rowGap]}>
                <RNText color={item.amount > 0 ? 'green' : 'red'}>
                  {formatNumber(item.amount, true)}
                </RNText>
                <RNText preset="subTitle">{formatTransactionDate(item.recordAt)}</RNText>
              </View>
            </View>
          );
        })}
    </View>
  );
}

export default memo(RecentTransactions, isEqual);
