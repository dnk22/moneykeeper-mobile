import {
  EXPENSE_INCOME_REPORT_CURRENT,
  EXPENSE_INCOME_REPORT_FREE,
  EXPENSE_INCOME_REPORT_MONTH,
  EXPENSE_INCOME_REPORT_QUART,
  EXPENSE_INCOME_REPORT_YEAR,
} from 'utils/constants/navigation.constant';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { VIEW_EXPENSE_INCOME_REPORT_BY } from 'utils/constants';
import { SCREEN_WIDTH } from 'share/dimensions';
import Summary from './Summary';
import SummaryNow from './SummaryNow';

const ExpenseIncomeReportStack = createMaterialTopTabNavigator<any>();

function ExpenseIncomeReport() {
  return (
    <ExpenseIncomeReportStack.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: {
          width: SCREEN_WIDTH / 4,
        },
        lazy: true,
      }}
    >
      <ExpenseIncomeReportStack.Screen
        options={{ title: 'Hiện tại' }}
        name={EXPENSE_INCOME_REPORT_CURRENT}
      >
        {() => <SummaryNow />}
      </ExpenseIncomeReportStack.Screen>
      <ExpenseIncomeReportStack.Screen
        options={{ title: 'Tháng' }}
        name={EXPENSE_INCOME_REPORT_MONTH}
      >
        {() => <Summary type={VIEW_EXPENSE_INCOME_REPORT_BY.MONTH} />}
      </ExpenseIncomeReportStack.Screen>
      <ExpenseIncomeReportStack.Screen
        options={{ title: 'Quý' }}
        name={EXPENSE_INCOME_REPORT_QUART}
      >
        {() => <Summary type={VIEW_EXPENSE_INCOME_REPORT_BY.QUARTER} />}
      </ExpenseIncomeReportStack.Screen>
      <ExpenseIncomeReportStack.Screen options={{ title: 'Năm' }} name={EXPENSE_INCOME_REPORT_YEAR}>
        {() => <Summary type={VIEW_EXPENSE_INCOME_REPORT_BY.YEAR} />}
      </ExpenseIncomeReportStack.Screen>
      <ExpenseIncomeReportStack.Screen
        options={{ title: 'Tùy chỉnh' }}
        name={EXPENSE_INCOME_REPORT_FREE}
      >
        {() => <Summary type={VIEW_EXPENSE_INCOME_REPORT_BY.FREE} />}
      </ExpenseIncomeReportStack.Screen>
    </ExpenseIncomeReportStack.Navigator>
  );
}

export default ExpenseIncomeReport;
