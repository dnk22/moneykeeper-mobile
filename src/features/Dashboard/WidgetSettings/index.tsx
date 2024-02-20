import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { CheckboxComponent, PressableHaptic, RNText, SvgIcon } from 'components/index';
import HeaderIcon from 'navigation/elements/HeaderIcon';
import { useCustomTheme } from 'resources/theme';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useSelector } from 'react-redux';
import { selectWidgetOrder } from 'store/app/app.selector';
import { useAppDispatch } from 'store/index';
import { updateWidgetOrder } from 'store/app/app.slice';
import { WidgetOrderListProps } from '../constants';
import styles from './styles';

function WidgetSettings({ navigation }: any) {
  const { colors } = useCustomTheme();
  const dispatch = useAppDispatch();
  const widgetOrder = useSelector((state) => selectWidgetOrder(state));
  const [data, setData] = useState(widgetOrder);

  const onSaveSettings = () => {
    dispatch(updateWidgetOrder(data));
    navigation.goBack();
  };

  // Use `setOptions` to update account
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderIcon onPress={onSaveSettings} />,
      headerLeft: () => <HeaderIcon name="cancel" onPress={() => navigation.goBack()} />,
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTintColor: 'white',
    });
  }, [data]);

  const onMoveUp = (index: number) => {
    const tempData = [...data];
    const targetData = tempData[index];
    tempData[index] = tempData[index - 1];
    tempData[index - 1] = targetData;
    setData(tempData);
  };

  const onChangeActive = (item: WidgetOrderListProps, index: number) => {
    const tempData = [...data];
    tempData[index] = {
      ...item,
      isActive: !item.isActive,
    };
    setData(tempData);
  };

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<WidgetOrderListProps>) => {
    const index = getIndex();
    return (
      <ScaleDecorator activeScale={1.03}>
        <View style={styles.item}>
          <View style={styles.itemCol}>
            <CheckboxComponent
              type="checkbox"
              size={22}
              check={item.isActive}
              onPress={() => onChangeActive(item, index)}
            />
            <RNText>{item.label}</RNText>
          </View>
          <View
            style={[
              styles.itemCol,
              {
                gap: 25,
              },
            ]}
          >
            {!!getIndex() && (
              <PressableHaptic onPress={() => onMoveUp(index)}>
                <SvgIcon name="arrowUp" size={16} color={isActive ? colors.primary : colors.text} />
              </PressableHaptic>
            )}
            <PressableHaptic onLongPress={drag} disabled={isActive}>
              <SvgIcon name="drag" size={20} color={isActive ? colors.primary : colors.text} />
            </PressableHaptic>
          </View>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />
    </View>
  );
}
export default WidgetSettings;
