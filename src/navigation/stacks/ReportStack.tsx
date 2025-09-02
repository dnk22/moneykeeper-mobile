import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpenseIncomeReport from 'features/Report/ExpenseIncome';
import HomeReport from 'features/Report';
import { useCustomTheme } from 'resources/theme';
import { ROUTES } from 'navigation/constants/routes';
import { ReportParamList } from 'navigation/types';
import SharedScreens from './SharedStacks';

//set up routes
const ReportStack = createNativeStackNavigator<ReportParamList>();

function ReportNavigation() {
  const { colors } = useCustomTheme();

  return (
    <ReportStack.Navigator
      initialRouteName={ROUTES.HOME_REPORT}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
      <ReportStack.Screen
        name={ROUTES.HOME_REPORT}
        component={HomeReport}
        options={{
          title: 'Phân tích và báo cáo',
        }}
      />

      <ReportStack.Screen
        name={ROUTES.EXPENSE_INCOME_REPORT}
        component={ExpenseIncomeReport}
        options={{
          title: 'Thu & Chi',
        }}
      />
      {SharedScreens({ stack: ReportStack })}
    </ReportStack.Navigator>
  );
}

export default ReportNavigation;
