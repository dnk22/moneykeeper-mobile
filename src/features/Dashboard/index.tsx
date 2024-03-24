import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { selectWidgetOrder } from 'store/app/app.selector';
import { useSelector } from 'react-redux';
import FinancialStatement from './Widgets/FinancialStatement';
import { WIDGET_IMPORT_LIST } from './constants';
import { isArray } from 'lodash';
import styles from './styles';

function Dashboard() {
  const { colors } = useCustomTheme();
  const widgetOrder = useSelector((state) => selectWidgetOrder(state));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FinancialStatement />
      <ScrollView style={styles.widgetView}>
        {isArray(widgetOrder) &&
          widgetOrder.map((item) => {
            if (item.isActive) {
              const Widget = WIDGET_IMPORT_LIST[item.key].default;
              return <Widget key={item.key} title={item.label} />;
            }
          })}
      </ScrollView>
    </View>
  );
}

export default Dashboard;
