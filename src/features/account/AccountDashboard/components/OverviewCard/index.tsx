import { useMemo, useState } from 'react';
import { View } from 'react-native';
import RNText from 'components/Text';
import PressableHaptic from 'components/PressableHaptic';
import ImageComponent from 'components/ImageComponent';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { overviewCardStyles as styles } from './styles';
import { formatNumber } from 'utils/math';

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
  const [isHideTotalAsset, setIsHideTotalAsset] = useState(false);

  const totalAssetText = useMemo(() => {
    if (isHideTotalAsset) {
      return 'VND ********';
    }

    return `VND ${formatNumber(totalAsset)}`;
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
          <RNText color={colors.textSecondary}>Tổng tài sản</RNText>
          <PressableHaptic onPress={() => setIsHideTotalAsset(!isHideTotalAsset)}>
            {isHideTotalAsset ? (
              <Eye size={20} color={colors.text} />
            ) : (
              <EyeSlash size={20} color={colors.text} />
            )}
          </PressableHaptic>
        </View>
        <RNText fontSize={20} style={styles.overviewAmount}>
          {totalAssetText}
        </RNText>
      </View>
      <View
        style={[
          styles.chartCard,
          {
            borderColor: colors.divider,
          },
        ]}
      >
        <ImageComponent name="investment" size={32} />
      </View>
    </View>
  );
}

export default OverviewCard;
