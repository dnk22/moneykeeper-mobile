import { View } from 'react-native';
import RNText from 'components/Text';
import PressableHaptic from 'components/PressableHaptic';
import debounce from 'lodash/debounce';
import { ArrowSwapHorizontal } from 'iconsax-react-native';
import styles from './styles';

function Header({
  colors,
  isActive,
  setPageIndex,
}: {
  colors: any;
  isActive: boolean;
  setPageIndex: (index: number) => void;
}) {
  return (
    <View style={[styles.header, { borderBottomColor: colors.divider }]}>
      <RNText style={styles.title}>{isActive ? `Đang sử dụng` : 'Ngừng hoạt động'}</RNText>
      <PressableHaptic
        onPress={debounce(() => setPageIndex(isActive ? 1 : 0), 200)}
        style={styles.iconSwapContainer}
      >
        <ArrowSwapHorizontal size="28" color={colors.text} />
      </PressableHaptic>
    </View>
  );
}

export default Header;
