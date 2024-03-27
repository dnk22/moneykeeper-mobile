import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_REPORT } from 'navigation/constants';
import { ReportParamList } from 'navigation/types';

// import route component
import HomeReport from 'features/Report';
import { useCustomTheme } from 'resources/theme';
import ChangeView from './ChangeView';
import CommonStack from 'navigation/CommonStack';

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
        headerBackTitleVisible: false,
      }}
    >
      <ReportStack.Screen
        name={HOME_REPORT}
        component={HomeReport}
        options={{
          title: 'Phân tích và báo cáo',
          headerRight: (props) => <ChangeView {...props} />,
        }}
      />
      <ReportStack.Group>
        {CommonStack({ Stack: ReportStack, parentName: 'HOME_REPORT' })}
      </ReportStack.Group>
    </ReportStack.Navigator>
  );
}

export default ReportNavigation;
