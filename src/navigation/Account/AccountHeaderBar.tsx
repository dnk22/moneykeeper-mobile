import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { RNText, SvgIcon, PressableHaptic } from 'components/index';
import { SafeAreaView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

function AccountHeaderBar() {
  const { colors } = useCustomTheme();
  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View style={[styles.headerBar, { backgroundColor: colors.primary }]}>
        <PressableHaptic style={[styles.actionView, styles.leftAction]}>
          <SvgIcon name="panel" color="white" />
        </PressableHaptic>
        <View style={styles.actionView}>
          <RNText color="white" preset="linkLarge">
            Tài khoản
          </RNText>
        </View>
        <PressableHaptic style={[styles.actionView, styles.rightAction]}>
          <SvgIcon name="search" color="white" />
        </PressableHaptic>
      </View>
    </SafeAreaView>
  );
}
export default memo(AccountHeaderBar, isEqual);
