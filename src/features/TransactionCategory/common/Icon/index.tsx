import { memo } from 'react';
import { View } from 'react-native';
import SvgIcon from 'components/SvgIcon';
import isEqual from 'react-fast-compare';
import ShakeAnimation from 'resources/animations/Shake';
import { useAppSelector } from 'store/index';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';
import styles from './styles';

type IconProps = {
  icon: any;
  isDisabled?: boolean;
};

function Icon({ icon, isDisabled = false }: IconProps) {
  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state)) && !isDisabled;
  return (
    <ShakeAnimation isActiveAnim={isUpdateMode}>
      <View style={styles.iconView}>
        <SvgIcon name={icon} size={24} />
        {isUpdateMode && (
          <SvgIcon name="pencilCircle" size={12} style={styles.iconViewEdit} color="red" />
        )}
      </View>
    </ShakeAnimation>
  );
}
export default memo(Icon, isEqual);
