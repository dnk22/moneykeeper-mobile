import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { queryAllAccount } from 'database/querying';
import FlatList from 'components/FlatList';
import { TAccount, TAccountType } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import {
  ACCOUNT,
  ACCOUNT_CREDIT_CARD_DETAIL,
  ACCOUNT_NORMAL_DETAIL,
  ADD_ACCOUNT,
} from 'utils/constants/navigation.constant';
import { ACCOUNT_CATEGORY_ID } from 'utils/constants';
import { styles } from './styles';
import IconComponent from 'components/IconComponent';
import PressableHaptic from 'components/PressableHaptic';
import RNText from 'components/Text';
import { AccountType } from 'utils/data';

const ACCOUNT_MIGHT_OPEN = [
  {
    name: 'Momo',
  },
];

function Wallets({ title }: { title: string }) {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const [accounts, setAccount] = useState([]);

  useFocusEffect(
    useCallback(() => {
      queryAllAccount({}).then((res) => setAccount(res));
    }, []),
  );

  const handleOnItemPress = (account: TAccount) => {
    const { id, accountName, accountTypeId, creditCardLimit } = account;
    switch (accountTypeId) {
      case ACCOUNT_CATEGORY_ID.CREDITCARD:
        navigation.navigate(ACCOUNT_CREDIT_CARD_DETAIL, {
          accountId: id,
          accountName,
          creditCardLimit,
        });
        break;
      default:
        navigation.navigate(ACCOUNT);
        navigation.navigate(ACCOUNT_NORMAL_DETAIL, {
          accountId: id,
          accountName,
        });
        break;
    }
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return (
      <PressableHaptic onPress={() => handleOnItemPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <View style={styles.itemTop}>
            <View style={styles.amountView}>
              <RNText style={styles.title} fontSize={13}>
                Số dư:
              </RNText>
              <RNText style={styles.amount}>{formatNumber(item.closingAmount, true)}</RNText>
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

  const renderDemoAccount = ({ item }: { item: TAccountType }) => {
    return (
      <View style={styles.wallet}>
        <IconComponent name={item.icon} />
        <RNText fontSize={12}>{item.name}</RNText>
      </View>
    );
  };

  const onNavigateAddAccount = () => {
    navigation.navigate(ADD_ACCOUNT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText preset="widgetTitle">{title}</RNText>
        {!!accounts.length && (
          <PressableHaptic onPress={() => navigation.navigate(ACCOUNT)}>
            <RNText preset="widgetViewMore">Xem tất cả</RNText>
          </PressableHaptic>
        )}
      </View>
      {!!!accounts.length && (
        <PressableHaptic onPress={onNavigateAddAccount}>
          <View style={[styles.noData, { backgroundColor: colors.surface }]}>
            <FlatList horizontal data={AccountType.slice(0, 3)} renderItem={renderDemoAccount} />
            <RNText preset="subTitle" numberOfLines={2}>
              Thêm ví để quản lý tài chính hiệu quả hơn.
            </RNText>
          </View>
        </PressableHaptic>
      )}
      {!!accounts.length && <FlatList horizontal data={accounts} renderItem={renderItem} />}
    </View>
  );
}
export default Wallets;
