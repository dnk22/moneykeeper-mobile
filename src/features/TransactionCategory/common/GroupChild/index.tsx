import { View } from 'react-native';
import { FlatListComponent, RNText, TouchableHighlightComponent } from 'components/index';
import { TTransactionsCategory } from 'database/types';
import { SCREEN_WIDTH } from 'share/dimensions';
import { withObservables } from '@nozbe/watermelondb/react';

import styles from './styles';
import Icon from '../Icon';

const width = (SCREEN_WIDTH - 40) / 4;

type ChildProps = {
  data: any;
  isDisabled?: boolean;
  horizontal?: boolean;
  onItemCategoryPress: (item: TTransactionsCategory) => void;
};

function GroupChild({ data, isDisabled, horizontal, onItemCategoryPress }: ChildProps) {
  const renderItem = ({ item }: { item: TTransactionsCategory }) => {
    return (
      <TouchableHighlightComponent onPress={() => onItemCategoryPress(item)}>
        <CategoryChildItemObserve item={item} isDisabled={isDisabled} />
      </TouchableHighlightComponent>
    );
  };

  return (
    <FlatListComponent
      data={data}
      horizontal={horizontal}
      style={styles.childView}
      renderItem={renderItem}
    />
  );
}

const CategoryChildItemObserve = withObservables(['item'], ({ item }) => ({
  item: item.observe(),
}))(Item);

function Item({ item, isDisabled }: { item: TTransactionsCategory; isDisabled?: boolean }) {
  return (
    <View style={[styles.itemChild, { width }]}>
      <Icon icon={item.icon} isDisabled={isDisabled} />
      <RNText numberOfLines={1}>{item.categoryName}</RNText>
    </View>
  );
}

export default GroupChild;
