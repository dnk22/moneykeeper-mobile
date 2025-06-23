import { GestureResponderEvent, Image, View } from 'react-native';
import Text from 'components/Text';
import Switch from 'components/Switch';
import CheckboxComponent from 'components/Checkbox';
import PressableHaptic from 'components/PressableHaptic';
import switchTheme from 'react-native-theme-switch-animation';
import { useCustomTheme } from 'resources/theme';
import { light, dark } from 'assets/images/common';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectAppearanceConfig } from 'store/app/app.selector';
import { updateAppearanceConfig } from 'store/app/app.slice';
import { MenuView } from '@react-native-menu/menu';
import { COLOR_SCHEME } from 'resources/theme/constants';
import styles from './styles';

const itemMode = [
  { mode: false, source: light },
  { mode: true, source: dark },
];

const colorSchemePickerList = [
  {
    title: 'Xanh năng động',
    id: String(COLOR_SCHEME.modernBlue),
  },
  {
    title: 'Xanh thanh lịch',
    id: String(COLOR_SCHEME.elegantGreen),
  },
  {
    title: 'Tím công nghệ',
    id: String(COLOR_SCHEME.techPurple),
  },
];

function Appearance() {
  const { darkMode, auto } = useAppSelector((state) => selectAppearanceConfig(state));
  const dispatch = useAppDispatch();
  const { colors } = useCustomTheme();

  const onHandleUpdateTheme = (e: GestureResponderEvent, newTheme: any) => {
    const { pageX = 0, pageY = 0 } = e.nativeEvent; // Lấy vị trí trên màn hình
    switchTheme({
      switchThemeFunction: () => {
        dispatch(updateAppearanceConfig(newTheme));
      },
      animationConfig: {
        type: newTheme.color ? 'fade' : 'circular',
        duration: 600,
        startingPoint: {
          cx: pageX,
          cy: pageY,
        },
      },
    });
  };

  const onHandleColorChange = (e: any) => {
    const { nativeEvent } = e;
    const colorPicked = colorSchemePickerList.find((item) => item.id === nativeEvent.event)?.id;
    if (colorPicked) {
      onHandleUpdateTheme(e, { color: +colorPicked });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} preset="subTitle" fontSize={13}>
        Giao diện
      </Text>
      <View style={[styles.appearance, { backgroundColor: colors.surface }]}>
        <View style={styles.selectMode}>
          {itemMode.map(({ mode, source }) => (
            <PressableHaptic
              key={String(mode)}
              onPress={(event) => onHandleUpdateTheme(event, { darkMode: mode })}
            >
              <View style={styles.itemMode}>
                <Image
                  source={source}
                  style={[styles.itemDemo, auto && { opacity: 0.6 }]}
                  resizeMode="contain"
                />
                <CheckboxComponent type="radio" check={darkMode === mode} disabled={auto} />
              </View>
            </PressableHaptic>
          ))}
        </View>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <View style={styles.item}>
          <Text>Tự động</Text>
          <Switch
            value={auto}
            onValueChange={(value) => {
              dispatch(updateAppearanceConfig({ auto: value }));
            }}
          />
        </View>
        <View style={styles.item}>
          <Text>Màu sắc</Text>
          <View style={styles.colorPicker}>
            <MenuView
              title="Chọn màu sắc"
              onPressAction={onHandleColorChange}
              actions={colorSchemePickerList}
            >
              <View style={[styles.itemColor, { backgroundColor: colors.primary }]} />
            </MenuView>
          </View>
        </View>
      </View>
    </View>
  );
}
export default Appearance;
