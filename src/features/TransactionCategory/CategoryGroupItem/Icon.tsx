import { memo } from 'react';
import { View } from 'react-native';
import SvgIcon from 'components/SvgIcon';
import isEqual from 'react-fast-compare';
import ShakeAnimation from 'resources/animations/Shake';
import styles from './styles';
import { useAppSelector } from 'store/index';
import { selectUpdateModeStatus } from 'store/transactionCategory/transactionCategory.selector';

type IconProps = {
  icon: any;
};
function Icon({ icon }: IconProps) {
  const isUpdateMode = useAppSelector((state) => selectUpdateModeStatus(state));
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
