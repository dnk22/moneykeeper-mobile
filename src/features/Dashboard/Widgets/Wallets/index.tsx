import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { accountLocalQuery } from 'database/querying';
import PressableHaptic from 'components/PressableHaptic';
import ImageComponent from 'components/ImageComponent';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import { formatNumber } from 'utils/math';
import { useCustomTheme } from 'resources/theme';
import { FlatList } from 'react-native-gesture-handler';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants/account';
import { TAccount } from 'database/types';
import DemoAccount from './DemoAccount';
import styles from './styles';

// Định nghĩa kiểu dữ liệu cho account

function Wallets({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const [accounts, setAccount] = useState<TAccount[]>([]);

  const handleOnItemPress = (account: TAccount) => {
    if (account.accountTypeId === ACCOUNT_CATEGORY_ID.CREDITCARD) {
      navigation.navigate(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
        accountId: account.id,
        accountName: account.accountName,
      });
    } else {
      navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, {
        accountId: account.id,
        accountName: account.accountName,
      });
    }
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return (
      <PressableHaptic onPress={() => handleOnItemPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <View style={styles.topItem}>
            <View>
              <RNText style={styles.label} fontSize={10} preset="caption">
                Số dư:
              </RNText>
              <RNText style={styles.amount}>{formatNumber(item.closingAmount || 0, true)}</RNText>
            </View>
          </View>
          <View style={styles.walletName}>
            <ImageComponent name={item.accountLogo} size={22} />
            <RNText style={styles.title} fontSize={13}>
              {item.accountName}
            </RNText>
          </View>
        </View>
      </PressableHaptic>
    );
  };

  useFocusEffect(
    useCallback(() => {
      accountLocalQuery.getAccounts().then((res: any) => setAccount(res));
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText preset="widgetTitle">{title}</RNText>
        {!!accounts.length && (
          <PressableHaptic onPress={() => navigation.navigate(ROUTES.ACCOUNT)}>
            <RNText preset="widgetViewMore">Xem tất cả</RNText>
          </PressableHaptic>
        )}
      </View>

      {!!!accounts.length && (
        <View style={[styles.noData, { backgroundColor: colors.surface }]}>
          <DemoAccount colors={colors} />
        </View>
      )}

      {!!accounts.length && <FlatList horizontal data={accounts} renderItem={renderItem} />}
    </View>
  );
}

export default Wallets;
