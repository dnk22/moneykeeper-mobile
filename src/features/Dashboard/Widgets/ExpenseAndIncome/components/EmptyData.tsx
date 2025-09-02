import { GestureResponderEvent, View } from 'react-native';
import RNText from 'components/Text';
import { AddSquare } from 'iconsax-react-native';
import PressableHaptic from 'components/PressableHaptic';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import { styles } from '../styles';

export default function EmptyData({ colors }: { colors: any }) {
  const navigation = useNavigation<any>();

  const onNavigateToAddTransaction = (e: GestureResponderEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigation.navigate(ROUTES.TRANSACTIONS);
  };

  return (
    <View style={styles.noData}>
      <RNText color={colors.textSecondary} preset="subTitle">
        Hãy bắt đầu ghi chép chi tiêu của bạn!
      </RNText>
      <PressableHaptic style={styles.addTransactionNow} onPress={onNavigateToAddTransaction}>
        <View style={styles.addTransactionNow}>
          <AddSquare size={15} variant="Broken" color={colors.primary} />
          <RNText color={colors.primary} style={{ fontWeight: '500' }}>
            Thêm chi tiêu ngay
          </RNText>
        </View>
      </PressableHaptic>
    </View>
  );
}
