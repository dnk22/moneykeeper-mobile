import { useNavigation } from '@react-navigation/native';
import PressableHaptic from 'components/PressableHaptic';
import { WalletAdd1 } from 'iconsax-react-native';
import { ROUTES } from 'navigation/constants/routes';
import styles from './styles';

function AddButton({ colors }: { colors: string }) {
  const navigation = useNavigation<any>();

  return (
    <PressableHaptic
      style={[styles.createButton, { backgroundColor: colors }]}
      onPress={() => navigation.navigate(ROUTES.ADD_ACCOUNT)}
    >
      <WalletAdd1 size="32" color="white" />
    </PressableHaptic>
  );
}
export default AddButton;
