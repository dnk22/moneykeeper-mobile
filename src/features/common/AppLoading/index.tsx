import { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import Loading from 'components/Loading';
import { selectAppLoadingState } from 'store/app/app.selector';
import { useAppSelector } from 'store/index';
import { CustomTheme } from 'resources/theme';
import styles from './styles';

function AppLoading({ theme }: { theme: CustomTheme }) {
  const isAppLoading = useAppSelector((state) => selectAppLoadingState(state));

  if (!isAppLoading) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.loadingIndicator, { backgroundColor: theme.colors.background }]}>
        <Loading />
      </View>
    </View>
  );
}
export default memo(AppLoading, isEqual);
