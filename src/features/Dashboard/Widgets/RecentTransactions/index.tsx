import { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { styles } from './styles';
import { useCustomTheme } from 'resources/theme';
import { RNText, SvgIcon } from 'components/index';

function RecentTransactions() {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText preset="widgetTitle">Ghi chép gần đây</RNText>
        <View style={styles.viewMore}>
          <RNText preset="widgetViewMore">Xem tất cả</RNText>
          <SvgIcon name="forward" preset="forwardLink" color="#00a8e8" />
        </View>
      </View>
      {[1, 2, 3, 4].map((item) => {
        return (
          <View style={[styles.item, { backgroundColor: colors.surface }]} key={item}>
            <View style={styles.itemContent}>
              <View style={[styles.icon, { backgroundColor: colors.background }]}>
                <SvgIcon name="forward" preset="forwardLink" color="#00a8e8" />
              </View>
              <View style={styles.rowGap}>
                <RNText style={styles.itemCategory}>Ăn uống</RNText>
                <RNText numberOfLines={1} preset="subTitle">
                  Ăn trưa
                </RNText>
              </View>
            </View>
            <View style={[styles.itemDateTime, styles.rowGap]}>
              <RNText>+ 24.000</RNText>
              <RNText preset="subTitle">Hôm qua, 2:45</RNText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default memo(RecentTransactions, isEqual);
