import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { LoadingIndicatorContainer } from 'components/Loading';
import { selectAppLoadingState } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { CustomTheme } from 'resources/theme';

function AppLoading({ theme, darkMode }: { theme: CustomTheme; darkMode: boolean }) {
  const isAppLoading = useAppSelector((state) => selectAppLoadingState(state));

  if (!isAppLoading) {
    return <></>;
  }

  return <LoadingIndicatorContainer theme={theme} darkMode={darkMode} />;
}

export default AppLoading;
