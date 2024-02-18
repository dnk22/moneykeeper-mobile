import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { RNText, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getCurrentBalanceAllAccount, queryGetAllBalance } from 'database/querying';
import { styles } from './styles';
import { isArray } from 'lodash';
import { formatNumber } from 'utils/math';
import { NOTIFICATION } from 'navigation/constants';
import { getAllTriggerNotifications } from 'share/notifications';

function FinancialStatement() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();
  const [currentBalance, setCurrentBalance] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getCurrentBalanceAllAccount().then((res) => {
        if (res && isArray(res)) {
          const total = res.reduce((prev, cur) => (prev += cur.closingAmount), 0);
          setCurrentBalance(total);
        }
      });
    }, []),
  );

  const hello = useMemo(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return 'Good morning';
    } else if (currentTime >= 12 && currentTime < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }, [useIsFocused, new Date()]);

  const onNavigationNotification = () => {
    navigation.navigate(NOTIFICATION);
  };

  const onHideMoney = () => {
    queryGetAllBalance();
    getAllTriggerNotifications();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.top, { backgroundColor: colors.primary }]}>
        <RNText preset={'linkLarge'} color="white">{`${hello}, Duy!`}</RNText>
        <View>
          <Pressable onPress={onNavigationNotification}>
            <SvgIcon name="bell" color="white" />
          </Pressable>
        </View>
      </View>
      <View style={[styles.bottom, { backgroundColor: colors.primary }]}>
        <View style={{ position: 'relative', height: 80 }}>
          <View style={[styles.widgetCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.cardTopOutline, { backgroundColor: colors.primary }]}>
              <View style={[styles.cardTop, { backgroundColor: colors.surface }]}>
                <View style={[styles.cardTopCenter, { backgroundColor: colors.primary }]} />
              </View>
            </View>
            <View style={styles.totalBalance}>
              <View style={styles.viewTotalDetails}>
                <RNText color="gray" fontSize={12}>
                  Xem Chi tiết
                </RNText>
                <SvgIcon name="forward" preset="forwardLink" color="gray" />
              </View>
              <RNText preset="homeTotalBalance" color={colors.primary} style={{ maxWidth: '60%' }}>
                {formatNumber(currentBalance, true)}
              </RNText>
            </View>
          </View>
          <View style={[styles.leftToolbar, { backgroundColor: colors.primary }]}>
            <View style={[styles.sync, { backgroundColor: colors.surface }]}>
              <Pressable onPress={onHideMoney}>
                <SvgIcon name="sync" size={16} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(FinancialStatement, isEqual);
