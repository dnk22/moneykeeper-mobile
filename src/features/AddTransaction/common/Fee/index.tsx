import { useState } from 'react';
import { RNText, Switch } from 'components/index';
import { View } from 'react-native';
import styles from '../../styles.common';
import { useCustomTheme } from 'resources/theme';
import Collapsible from 'react-native-collapsible';
import Animated, { StretchInY } from 'react-native-reanimated';

type FeeProps = {
  children: any;
  onClose: () => void;
};

export default function Fee({ children, onClose }: FeeProps) {
  const { colors } = useCustomTheme();
  const [isShowFee, setIsShowFee] = useState<boolean>(false);

  const handleOnShowFee = () => {
    setIsShowFee(!isShowFee);
    if (!isShowFee) {
      onClose && onClose();
    }
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <View style={[styles.itemGroup, styles.itemGroupBetween]}>
        <RNText>Phí</RNText>
        <Switch value={isShowFee} onValueChange={handleOnShowFee} />
      </View>
      <Collapsible collapsed={!isShowFee}>
        <Animated.View entering={StretchInY}>{children}</Animated.View>
      </Collapsible>
    </View>
  );
}
