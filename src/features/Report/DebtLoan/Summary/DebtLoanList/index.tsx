import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { FlatListComponent, PressableHaptic, RNText, SvgIcon } from 'components/index';
import { debounce } from 'lodash';
import { useCustomTheme } from 'resources/theme';
import { DebtLoanTypes } from 'utils/types';
import Item from './Item';
import styles from './styles';

function DebtLoanList({ data }: { data: DebtLoanTypes[] }) {
  const { colors } = useCustomTheme();
  const [isViewActive, setIsViewActive] = useState(true);

  const { activeData, inActiveData } = useMemo(() => {
    const activeData = data.filter((item) => item.value !== 0);
    const inActiveData = data.filter((item) => item.value === 0);
    return { activeData, inActiveData };
  }, [data]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return <Item data={item} index={index} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <RNText style={styles.title}>{isViewActive ? 'Hiện tại' : 'Đã hoàn thành'}</RNText>
        <PressableHaptic
          onPress={debounce(() => setIsViewActive(!isViewActive), 200)}
          style={styles.iconSwapContainer}
        >
          <SvgIcon name="swap" size={24} />
        </PressableHaptic>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.content}>
        <FlatListComponent
          showSeparator
          data={isViewActive ? activeData : inActiveData}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
export default DebtLoanList;
