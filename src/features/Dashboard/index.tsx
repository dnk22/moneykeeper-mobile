import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { selectWidgetOrder } from 'store/app/app.selector';
import { useSelector } from 'react-redux';
import isArray from 'lodash/isArray';
import { RootState } from 'store/index';
import FinancialStatement from './Widgets/FinancialStatement';
import { WIDGET_IMPORT_LIST } from './constants';
import styles from './styles';

function Dashboard() {
  const { colors } = useCustomTheme();
  const widgetOrder = useSelector((state: RootState) => selectWidgetOrder(state));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FinancialStatement />
      <ScrollView style={styles.widgetView}>
        {isArray(widgetOrder) &&
          widgetOrder.map((item) => {
            if (item.isActive && item.key in WIDGET_IMPORT_LIST) {
              const Widget =
                WIDGET_IMPORT_LIST[item.key as keyof typeof WIDGET_IMPORT_LIST].default;
              return <Widget key={item.key} title={item.label} />;
            }
            return null;
          })}
      </ScrollView>
    </View>
  );
}

export default Dashboard;
