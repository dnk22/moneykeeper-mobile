import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { HOME_REPORT } from 'navigation/constants';
import { ReportParamList } from 'navigation/types';

// import route component
import HomeReport from 'features/Report';
import { useCustomTheme } from 'resources/theme';
import ChangeView from './ChangeView';

//set up routes
const ReportStack = createNativeStackNavigator<ReportParamList>();

function ReportNavigation() {
  const { colors } = useCustomTheme();

  const rootOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
    },
    headerTintColor: 'white',
  };
  return (
    <ReportStack.Navigator initialRouteName={HOME_REPORT} screenOptions={rootOptions}>
      <ReportStack.Screen
        name={HOME_REPORT}
        component={HomeReport}
        options={{
          title: 'Báo cáo và phân tích',
          headerRight: (props) => <ChangeView {...props} />,
        }}
      />
    </ReportStack.Navigator>
  );
}

export default ReportNavigation;
