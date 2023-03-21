import { MenuAction, MenuView, NativeActionEvent } from '@react-native-menu/menu';
import { RNText, SvgIcon } from 'components/index';
import { memo, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const RECENT = 'recent';
const MOST = 'most';

export const mapTitle: { [key: string]: string } = {
  [RECENT]: 'Sử dụng gần đây',
  [MOST]: 'Hay sử dụng',
};

const dropDownDefault: MenuAction[] = [
  {
    id: RECENT,
    title: 'Sử dụng gần đây',
  },
  {
    id: MOST,
    title: 'Hay sử dụng',
  },
];

function Recent() {
  const { colors } = useCustomTheme();
  const [viewType, setViewType] = useState<typeof RECENT | typeof MOST>(RECENT);

  const renderActions = useMemo(() => {
    return dropDownDefault.map((x) => {
      x.state = x.id === viewType ? 'on' : 'off';
      return x;
    });
  }, [viewType]);

  const onHandlePressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    setViewType(event);
  };

  return (
    <View style={[styles.group, styles.mostRecent, { backgroundColor: colors.surface }]}>
      <MenuView title="Xem nhanh" onPressAction={onHandlePressAction} actions={renderActions}>
        <View style={styles.menu}>
          <RNText color="#1BA7EF" style={{ opacity: 0.7 }}>
            Sử dụng gần đây
          </RNText>
          <SvgIcon name="forward" size={14} opacity={0.7} color="#1BA7EF" />
        </View>
      </MenuView>
    </View>
  );
}
export default memo(Recent, isEqual);
