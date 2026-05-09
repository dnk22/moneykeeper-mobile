import { useMemo, useState } from 'react';
import { View } from 'react-native';
import RNText from 'components/Text';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { overviewCardStyles as styles } from './styles';
import { formatNumber } from 'utils/math';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';

type OverviewCardProps = {
  totalAsset: number;
  colors: {
    surface: string;
    divider: string;
    text: string;
    textSecondary: string;
  };
};

function OverviewCard({ totalAsset, colors }: OverviewCardProps) {
  const navigation = useNavigation();

  const [isHideTotalAsset, setIsHideTotalAsset] = useState(false);

  const totalAssetText = useMemo(() => {
    if (isHideTotalAsset) {
      return '********';
    }

    return `${formatNumber(totalAsset)}`;
  }, [isHideTotalAsset, totalAsset]);

  return (
    <View style={styles.overviewSection}>
      <View
        style={[
          styles.overviewCard,
          {
            borderColor: colors.divider,
          },
        ]}
      >
        <View style={styles.overviewAmountRow}>
          <RNText fontSize={12}>Tổng tài sản</RNText>
          <PressableHaptic onPress={() => setIsHideTotalAsset(!isHideTotalAsset)}>
            {isHideTotalAsset ? (
              <Eye size={20} color={colors.text} />
            ) : (
              <EyeSlash size={20} color={colors.text} />
            )}
          </PressableHaptic>
        </View>
        <RNText fontSize={20} style={styles.overviewAmount}>
          <RNText fontSize={18} color={colors.textSecondary}>
            VND{' '}
          </RNText>
          {totalAssetText}
        </RNText>
      </View>
      <PressableHaptic onPress={() => navigation.navigate(ROUTES.FINANCE_STATEMENT as never)}>
        <View
          style={[
            styles.chartCard,
            {
              borderColor: colors.divider,
            },
          ]}
        >
          <SvgIcon name="pieChart" size={40} />
        </View>
      </PressableHaptic>
    </View>
  );
}

export default OverviewCard;
