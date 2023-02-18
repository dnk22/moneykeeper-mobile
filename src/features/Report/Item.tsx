import Animated, { Layout, StretchInX } from 'react-native-reanimated';
import { TouchableHighlight } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

const AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);

type ItemProps = {
  item: any;
  isGridView?: 'grid' | 'list';
};
function Item({ item, isGridView = 'grid' }: ItemProps) {
  const { colors } = useCustomTheme();
  const isGrid = isGridView === 'grid';
  return (
    <AnimatedTouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      layout={Layout.springify()}
      entering={StretchInX}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <Animated.View
        style={[
          styles.cardContent,
          {
            width: !isGrid ? (SCREEN_WIDTH - 30) / 2 : SCREEN_WIDTH - 20,
            height: !isGrid ? (SCREEN_WIDTH - 30) / 2 : 160,
          },
        ]}
      >
        <Animated.Image layout={Layout.springify()} source={item.icon} style={styles.image} />
        <Animated.View style={styles.textViewHolder} layout={Layout.springify()}>
          <Animated.Text layout={Layout} numberOfLines={1} style={styles.textOnImage}>
            {item.name}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </AnimatedTouchableHighlight>
  );
}

export default Item;
