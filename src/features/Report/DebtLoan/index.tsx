import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Loading from 'components/Loading';
import { useCustomTheme } from 'resources/theme';
import { DEBT, LOAN } from 'utils/constants/navigation.constant';
import DebtLoanSummary from './Summary';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();

function DebtLoanReport() {
  const { colors } = useCustomTheme();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPlaceholder: () => <Loading style={{ flex: 1 }} />,
          tabBarContentContainerStyle: styles.tabBarContentContainerStyle,
          tabBarIndicatorStyle: [styles.indicator, { backgroundColor: colors.primary }],
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: colors.text,
        }}
      >
        <Tab.Screen
          name={LOAN}
          options={{
            title: 'Cho vay',
          }}
        >
          {(props) => <DebtLoanSummary isDebt {...props} />}
        </Tab.Screen>
        <Tab.Screen name={DEBT} options={{ title: 'Khoản nợ' }}>
          {(props) => <DebtLoanSummary {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

export default DebtLoanReport;
