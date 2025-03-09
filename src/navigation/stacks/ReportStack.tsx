import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EXPENSE_INCOME_REPORT, HOME_REPORT } from 'utils/constants/navigation.constant';
import ExpenseIncomeReport from 'features/Report/ExpenseIncome';
import HomeReport from 'features/Report';
import { useCustomTheme } from 'resources/theme';

// import route component
// import ChangeView from './ChangeView';
import { ReportParamList } from 'navigation/types';
import CommonStack from './CommonStack';

//set up routes
const ReportStack = createNativeStackNavigator<ReportParamList>();

function ReportNavigation() {
  const { colors } = useCustomTheme();

  return (
    <ReportStack.Navigator
      initialRouteName={HOME_REPORT}
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
    >
      <ReportStack.Screen
        name={HOME_REPORT}
        component={HomeReport}
        options={{
          title: 'Phân tích và báo cáo',
          // headerRight: (props) => <ChangeView {...props} />,
        }}
      />

      <ReportStack.Screen
        name={EXPENSE_INCOME_REPORT}
        component={ExpenseIncomeReport}
        options={{
          title: 'Thu & Chi',
        }}
      />
      <ReportStack.Group>
        {CommonStack({ Stack: ReportStack, parentName: 'HOME_REPORT' })}
      </ReportStack.Group>
    </ReportStack.Navigator>
  );
}

export default ReportNavigation;
