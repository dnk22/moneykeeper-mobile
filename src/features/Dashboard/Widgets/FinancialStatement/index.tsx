import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import isEqual from 'react-fast-compare';
import RNText from 'components/Text';

import { useCustomTheme } from 'resources/theme';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getCurrentBalanceAllAccount, queryGetAllBalance } from 'database/querying';
import { formatNumber } from 'utils/math';
import { getAllTriggerNotifications } from 'share/notifications';
import { useAppDispatch } from 'store/index';
import { setViewType } from 'features/Report/FinancialStatement/reducer/financialStatement.slice';
import { ArrowRight2, NotificationBing, Repeat } from 'iconsax-react-native';
import { styles } from './styles';
import { ROUTES } from 'navigation/constants/routes';

function FinancialStatement() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [currentBalance, setCurrentBalance] = useState(0);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      // clear financial statement when go back to home
      dispatch(setViewType(true));
      getCurrentBalanceAllAccount().then((res) => {
        setCurrentBalance(res);
      });
    }, []),
  );

  const hello = useMemo(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return 'Good morning';
    if (currentTime < 17) return 'Good afternoon';
    return 'Good evening';
  }, [isFocused]);

  const onHideMoney = () => {
    queryGetAllBalance();
    getAllTriggerNotifications();
  };

  const onNavigateToScreen = (screenName: string) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.top, { backgroundColor: colors.primary }]}>
        <RNText preset={'textLarge'} color="white">{`${hello}, Duy!`}</RNText>
        <Pressable onPress={() => onNavigateToScreen(ROUTES.NOTIFICATION)} style={styles.notifications}>
          <NotificationBing size={25} color="white" variant="Broken" />
        </Pressable>
      </View>
      <View style={[styles.bottom, { backgroundColor: colors.primary }]}>
        <View style={{ position: 'relative' }}>
          <Pressable onPress={() => onNavigateToScreen(ROUTES.FINANCE_STATEMENT)}>
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
                  <ArrowRight2 size={16} color={colors.text} variant="Broken" />
                </View>
                <RNText
                  preset="homeTotalBalance"
                  color={colors.primary}
                  style={{ maxWidth: '80%' }}
                >
                  {formatNumber(currentBalance, true)}
                </RNText>
              </View>
            </View>
          </Pressable>
          <View style={[styles.leftToolbar, { backgroundColor: colors.primary }]}>
            <Pressable onPress={onHideMoney}>
              <View style={[styles.sync, { backgroundColor: colors.surface }]}>
                <Repeat color={colors.primary} />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(FinancialStatement, isEqual);
