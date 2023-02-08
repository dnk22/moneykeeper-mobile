import { memo, useMemo } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { styles } from './styles';
import { RNText, SvgIcon } from 'components/index';
import { useCustomTheme } from 'resources/theme';

function FinancialStatement() {
  const { colors } = useCustomTheme();
  const hello = useMemo(() => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return 'Good morning';
    } else if (currentTime >= 12 && currentTime < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }, [new Date().getHours()]);
  return (
    <View style={styles.container}>
      <View style={[styles.topBarBackground, { backgroundColor: colors.primary }]}>
        <View style={styles.widget}>
          <RNText
            style={styles.widgetText}
            preset={'linkLarge'}
            color="white"
          >{`${hello} , Duy!`}</RNText>
          <View style={[styles.widgetCard, { backgroundColor: colors.surface }]}>
            <View style={styles.topBarCurrency}>
              <View style={styles.viewTotalDetails}>
                <RNText color="gray">Xem Chi tiết</RNText>
                <SvgIcon name="forward" preset="forwardLink" color="gray" />
              </View>
              <RNText preset="homeTotalBalance">12.000.000</RNText>
            </View>
            <View style={[styles.topBarToolbar, { backgroundColor: colors.primary }]}>
              <SvgIcon name="bell" color="white" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(FinancialStatement, isEqual);
