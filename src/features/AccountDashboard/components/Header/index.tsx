import { useContext } from 'react';
import { View } from 'react-native';
import RNText from 'components/Text';
import PressableHaptic from 'components/PressableHaptic';
import { AccountContext } from 'features/AccountDashboard/context';
import debounce from 'lodash/debounce';
import { EmptyWalletRemove, EmptyWalletTick } from 'iconsax-react-native';
import styles from './styles';

function Header({ colors }: { colors: any }) {
  const { isActiveAccount, ACCOUNT_STATUS, setIsActiveAccount } = useContext(AccountContext);

  return (
    <View style={[styles.header, { borderBottomColor: colors.divider }]}>
      <RNText style={styles.title}>{isActiveAccount ? `Đang sử dụng` : 'Ngừng sử dụng'}</RNText>
      <PressableHaptic
        onPress={debounce(
          () =>
            setIsActiveAccount(isActiveAccount ? ACCOUNT_STATUS.INACTIVE : ACCOUNT_STATUS.ACTIVE),
          200,
        )}
        style={styles.iconSwapContainer}
      >
        {isActiveAccount ? (
          <EmptyWalletTick size="28" color={colors.primary} />
        ) : (
          <EmptyWalletRemove size="28" color={colors.primary} />
        )}
      </PressableHaptic>
    </View>
  );
}

export default Header;
