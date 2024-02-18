import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { IconComponent, PressableHaptic, RNText, SvgIcon } from 'components/index';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { queryAllAccount } from 'database/querying';
import FlatList from 'components/FlatList';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import {
  ACCOUNT,
  ACCOUNT_CREDIT_CARD_DETAIL,
  ACCOUNT_NORMAL_DETAIL,
  ADD_ACCOUNT,
} from 'navigation/constants';
import { ACCOUNT_CATEGORY_ID } from 'utils/constant';
import { styles } from './styles';

function Wallets() {
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
        navigation.navigate(ACCOUNT, {
          screen: ACCOUNT_CREDIT_CARD_DETAIL,
          params: {
            accountId: id,
            accountName,
            creditCardLimit,
          },
        });
        break;
      default:
        navigation.navigate(ACCOUNT, {
          screen: ACCOUNT_NORMAL_DETAIL,
          params: {
            accountId: id,
            accountName,
          },
        });
        break;
    }
  };

  const renderItem = ({ item }: { item: TAccount }) => {
    return (
      <PressableHaptic onPress={() => handleOnItemPress(item)}>
        <View style={[styles.item, { backgroundColor: colors.surface }]}>
          <SvgIcon name="accountBG" width={155} height={100} style={{ position: 'absolute' }} />
          <View style={styles.itemTop}>
            <View style={styles.amountView}>
              <RNText style={styles.title}>Số dư:</RNText>
              <RNText style={styles.amount}>{formatNumber(item.closingAmount, true)}</RNText>
            </View>
            <IconComponent name={item.accountLogo} />
          </View>
          <RNText style={styles.title} fontSize={12}>
            {item.accountName}
          </RNText>
        </View>
      </PressableHaptic>
    );
  };

  const onNavigateAccount = () => {
    navigation.navigate(ACCOUNT);
  };

  const onNavigateAddAccount = () => {
    navigation.navigate(ACCOUNT, { screen: ADD_ACCOUNT });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText preset="widgetTitle">Ví của bạn</RNText>
        {!!accounts.length && (
          <PressableHaptic onPress={onNavigateAccount}>
            <RNText preset="widgetViewMore">Xem tất cả</RNText>
          </PressableHaptic>
        )}
      </View>
      {!!!accounts.length && (
        <PressableHaptic onPress={onNavigateAddAccount}>
          <View style={[styles.noData, { backgroundColor: colors.surface }]}>
            <View style={[styles.addIcon, { backgroundColor: colors.primary }]}>
              <SvgIcon name="add" color="white" />
            </View>
            <RNText fontSize={12}>Bạn chưa có tài khoản nào, thêm mới ngay. </RNText>
          </View>
        </PressableHaptic>
      )}
      {!!accounts.length && <FlatList horizontal data={accounts} renderItem={renderItem} />}
    </View>
  );
}
export default Wallets;
