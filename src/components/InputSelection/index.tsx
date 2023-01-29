import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import styles from './styles';
import { IconProps } from 'components/SvgIcon/const';
import PressableHaptic from 'components/PressableHaptic';

type SelectedProps = {
  title?: string;
  icon?: IconProps;
  onSelect?: () => void;
  value?: string;
  onDelete?: () => void;
  required?: boolean;
};

function Selected({
  title,
  icon = 'questionCircle',
  onSelect,
  value,
  onDelete,
  required = true,
}: SelectedProps) {
  return (
    <PressableHaptic style={styles.itemGroup} onPress={onSelect}>
      <SvgIcon name={icon} />
      <View style={styles.groupContent}>
        {value && !required ? (
          <View style={styles.value}>
            <RNText fontSize={16}>{value}</RNText>
            <Pressable onPress={onDelete}>
              <SvgIcon name="closeCircle" size={16} />
            </Pressable>
          </View>
        ) : (
          <RNText fontSize={16}>{value || title}</RNText>
        )}

        <SvgIcon name="forward" size={16} style={styles.iconForward} />
      </View>
    </PressableHaptic>
  );
}

export default memo(Selected, isEqual);
