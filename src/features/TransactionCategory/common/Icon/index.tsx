import React, { memo, useContext } from 'react';
import { View } from 'react-native';
import SvgIcon from 'components/SvgIcon';
import isEqual from 'react-fast-compare';
import ShakeAnimation from 'resources/animations/Shake';
import { TransactionCategoryContext } from 'navigation/TransactionCategory/components/TabBar';
import styles from './styles';

type IconProps = {
  icon: any;
  isDisabled?: boolean;
};

function Icon({ icon, isDisabled = false }: IconProps) {
  const { isUpdate } = useContext<any>(TransactionCategoryContext);

  const isUpdateMode = isUpdate && !isDisabled;
  return (
    <ShakeAnimation isActiveAnim={isUpdateMode}>
      <View style={styles.iconView}>
        <SvgIcon name={icon} size={24} />
      </View>
    </ShakeAnimation>
  );
}
export default memo(Icon, isEqual);
