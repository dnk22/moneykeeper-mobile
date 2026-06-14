import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomTheme } from 'resources/theme';
import { selectAppearanceConfig } from 'store/app/app.selector';
import { useSelector } from 'react-redux';
import isArray from 'lodash/isArray';
import { RootState } from 'store/index';
import FinancialStatement from './Widgets/FinancialStatement';
import { WIDGET_IMPORT_LIST } from './constants';
import styles from './styles';

function Dashboard() {
  const { colors } = useCustomTheme();
  const { homeWidgetOrder } = useSelector((state: RootState) => selectAppearanceConfig(state));

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.primary }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <FinancialStatement />
        <ScrollView style={styles.widgetView} contentContainerStyle={{ gap: 10 }}>
          {isArray(homeWidgetOrder) &&
            homeWidgetOrder.map((item) => {
              if (item.isActive && item.key in WIDGET_IMPORT_LIST) {
                const Widget =
                  WIDGET_IMPORT_LIST[item.key as keyof typeof WIDGET_IMPORT_LIST].default;
                return <Widget key={item.key} title={item.label} />;
              }
              return null;
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Dashboard;
