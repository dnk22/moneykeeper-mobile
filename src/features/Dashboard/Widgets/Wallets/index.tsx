import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { queryAllAccount } from 'database/querying';
import PressableHaptic from 'components/PressableHaptic';
import IconComponent from 'components/IconComponent';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import { formatNumber } from 'utils/math';
import { useCustomTheme } from 'resources/theme';
import { FlatList } from 'react-native-gesture-handler';
import DemoAccount from './DemoAccount';
import styles from './styles';

// Định nghĩa kiểu dữ liệu cho account
interface Account {
  _id: string;
  accountName: string;
  accountType: string;
  closingAmount?: number;
  accountLogo?: string;
}

function Wallets({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const [accounts, setAccount] = useState<Account[]>([]);

  const fetchBanksData = async () => {
    try {
      // Giả lập fetch data
      return [];
    } catch (e) {
      return [];
    }
  };

  const handleOnItemPress = (account: Account) => {
    if (account.accountType === 'normal') {
      navigation.navigate(ROUTES.ACCOUNT_NORMAL_DETAIL, {
        accountId: account._id,
        accountName: account.accountName,
      });
    } else {
      navigation.navigate(ROUTES.ACCOUNT_CREDIT_CARD_DETAIL, {
        accountId: account._id,
        accountName: account.accountName,
      });
    }
  };

  const renderItem = ({ item }: { item: Account }) => {
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
          <RNText style={styles.title} fontSize={12}>
            {item.accountName}
          </RNText>
          <IconComponent name={item.accountLogo} style={styles.accountIcon} />
        </View>
      </PressableHaptic>
    );
  };

  useFocusEffect(
    useCallback(() => {
      queryAllAccount({}).then((res: any) => setAccount(res));
    }, []),
  );

  useEffect(() => {
    if (!accounts.length) {
      fetchBanksData();
    }
  }, []);

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
