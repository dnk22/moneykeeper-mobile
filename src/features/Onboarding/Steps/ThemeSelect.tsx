import { GestureResponderEvent, Pressable, View } from 'react-native';
import Text from 'components/Text';
import CheckboxComponent from 'components/Checkbox';
import Switch from 'components/Switch';
import FastImage from '@d11/react-native-fast-image';
import switchTheme from 'react-native-theme-switch-animation';
import { useCustomTheme } from 'resources/theme';
import { TonBoardingConfig } from 'utils/types/store.type';
import { light, dark } from 'assets/images/common';
import { useAppDispatch, useAppSelector } from 'store/index';
import { updateAppearanceConfig } from 'store/app/app.slice';
import { selectAppearanceConfig } from 'store/app/app.selector';
import { commonStyle, themeStyles } from './styles';

function ThemeSelect() {
  const dispatch = useAppDispatch();
  const { colors } = useCustomTheme();
  const { auto, darkMode } = useAppSelector((state) => selectAppearanceConfig(state));

  const onSelectTheme = (config: Partial<TonBoardingConfig['appearance']>) => {
    dispatch(updateAppearanceConfig(config));
  };

  const onHandleUpdateTheme = (e: GestureResponderEvent, newTheme: any) => {
    if (auto) return;
    const { pageX = 0, pageY = 0 } = e.nativeEvent;
    switchTheme({
      switchThemeFunction: () => {
        onSelectTheme(newTheme);
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

  return (
    <View style={themeStyles.container}>
      <Text fontSize={26} style={commonStyle.title}>
        Chọn giao diện hiển thị
      </Text>
      <View style={themeStyles.form}>
        <View style={[themeStyles.column, { opacity: auto ? 0.6 : 1 }]}>
          <Pressable
            style={themeStyles.imageContainer}
            onPress={(e) =>
              onHandleUpdateTheme(e, {
                auto: false,
                darkMode: false,
              })
            }
          >
            <FastImage
              defaultSource={light}
              source={light}
              style={themeStyles.image}
              resizeMode="stretch"
            />
          </Pressable>
          <CheckboxComponent type="radio" check={!darkMode} />
        </View>
        <View style={[themeStyles.column, { opacity: auto ? 0.6 : 1 }]}>
          <Pressable
            style={themeStyles.imageContainer}
            onPress={(e) =>
              onHandleUpdateTheme(e, {
                auto: false,
                darkMode: true,
              })
            }
          >
            <FastImage
              defaultSource={dark}
              source={dark}
              style={themeStyles.image}
              resizeMode="stretch"
            />
          </Pressable>
          <CheckboxComponent type="radio" check={darkMode} />
        </View>
      </View>
      <View style={[themeStyles.item, { backgroundColor: colors.surface }]}>
        <Text>Tự động</Text>
        <Switch
          value={auto}
          onValueChange={(value) => {
            onSelectTheme({
              auto: value,
            });
          }}
        />
      </View>
    </View>
  );
}

export default ThemeSelect;
