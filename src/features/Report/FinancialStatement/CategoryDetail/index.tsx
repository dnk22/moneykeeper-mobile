import { useRef, useState } from 'react';
import { View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { SCREEN_WIDTH } from 'share/dimensions';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectPageView } from '../reducer/financialStatement.selector';
import { setPageView } from '../reducer/financialStatement.slice';
import Level1View from './Level1View';
import Level2View from './Level2View';
import styles from './styles';

const renderScene = SceneMap({
  root: Level1View,
  lv2: Level2View,
});

function CategoryDetail() {
  const dispatch = useAppDispatch();
  const index = useAppSelector((state) => selectPageView(state));
  const [routes] = useState([{ key: 'root' }, { key: 'lv2' }]);
  const prevIndex = useRef(0);

  const setPageIndex = (page: number) => {
    // if go back to pager 1, delete data lv2 
    dispatch(setPageView({ page, resetLv2: !!!prevIndex.current }));
    prevIndex.current = page;
  };

  return (
    <View style={styles.detail}>
      <TabView
        swipeEnabled={index ? true : false}
        renderTabBar={() => undefined}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setPageIndex}
        initialLayout={{ width: SCREEN_WIDTH }}
        sceneContainerStyle={{ paddingHorizontal: 5 }}
      />
    </View>
  );
}
export default CategoryDetail;
