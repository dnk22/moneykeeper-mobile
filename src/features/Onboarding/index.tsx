import { View } from 'react-native';
import RNText from 'components/Text';
import StatusBar from 'components/StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';
import { SCREEN_WIDTH } from 'share/dimensions';
import StepIndicator from './StepIndicator';
import SubmitButton from './SubmitButton';
import Welcome from './Steps/Welcome';
import ThemeSelect from './Steps/ThemeSelect';
import Notify from './Steps/Notify';
import useOnboardingHook from './hook';
import EndOnboarding from './Steps/EndOnboarding';
import { styles } from './styles';

const renderScene = SceneMap({
  welcome: Welcome,
  theme: ThemeSelect,
  // dateConfig: DateConfig,
  notification: Notify,
  endOnboarding: EndOnboarding,
});

function Onboarding() {
  const { colors, step, steps, setStep, onNext } = useOnboardingHook();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'right', 'left', 'bottom']}
    >
      <StatusBar barStyle="default" />
      {steps.length - 1 !== step && (
        <View style={styles.header}>
          <RNText color={colors.primary}>Bỏ qua</RNText>
        </View>
      )}
      <TabView
        swipeEnabled={steps.length - 1 !== step}
        renderTabBar={() => undefined}
        navigationState={{ index: step, routes: steps }}
        lazy={({ route }) => route.key === 'endOnboarding'}
        renderScene={renderScene}
        onIndexChange={setStep}
        initialLayout={{ width: SCREEN_WIDTH }}
      />
      {steps.length - 1 !== step && (
        <View style={styles.footer}>
          <StepIndicator step={step} steps={steps} />
          <SubmitButton step={step} onPress={onNext} isLastStep={steps.length - 2 === step} />
        </View>
      )}
    </SafeAreaView>
  );
}

export default Onboarding;
