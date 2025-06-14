import { memo, useEffect, useRef, useState } from 'react';
import { AppState, Appearance } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import isEqual from 'react-fast-compare';

function BlurScreen() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const colorScheme = Appearance.getColorScheme();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (appStateVisible === 'active') {
    return <></>;
  }

  return (
    <BlurView
      style={{
        zIndex: 999999,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
      blurType={colorScheme}
    />
  );
}
export default memo(BlurScreen, isEqual);
