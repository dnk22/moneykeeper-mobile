import { TouchableHighlight } from 'react-native';
import Animated, { Layout, StretchInX } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SCREEN_WIDTH } from 'share/dimensions';
import { useCustomTheme } from 'resources/theme';
import Statement from 'assets/images/report/statement.svg';
import styles from './styles';

const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);

type ItemProps = {
  item: any;
  isGridView?: boolean;
};

function Item({ item, isGridView }: ItemProps) {
  const navigation = useNavigation();
  const { colors } = useCustomTheme();

  return (
    <AnimatedTouchableHighlight
      activeOpacity={0.8}
      underlayColor="#DDDDDD"
      layout={Layout.springify()}
      entering={StretchInX}
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => navigation.navigate(item.link)}
    >
      <Animated.View
        style={[
          styles.cardContent,
          {
            width: !isGridView ? (SCREEN_WIDTH - 30) / 2 : SCREEN_WIDTH - 20,
            height: !isGridView ? (SCREEN_WIDTH - 30) / 2 : 160,
          },
        ]}
      >
        <Statement />
        <Animated.View
          style={[styles.textViewHolder, { backgroundColor: colors.primary, opacity: 0.5 }]}
          layout={Layout.springify()}
        >
          <Animated.Text layout={Layout} numberOfLines={1} style={styles.textOnImage}>
            {item.name}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </AnimatedTouchableHighlight>
  );
}

export default Item;
