import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { VirtualizedList, VirtualizedListProps } from 'react-native';

type VirtualizedListComponentProps = VirtualizedListProps<any> & { id?: string };

function VirtualizedListComponent({
  id = 'id',
  data,
  getItem,
  renderItem,
  windowSize = 17,
  maxToRenderPerBatch = 10,
  initialNumToRender = 6,
  ...rest
}: VirtualizedListComponentProps) {
  const keyExtractor = (item: any) => item[id];
  const getItemData = (_data: unknown[], index: number): any => {
    return _data[index];
  };
  const getItemCount = (_data: unknown[]) => _data.length;

  return (
    <VirtualizedList
      data={data}
      initialNumToRender={initialNumToRender}
      windowSize={windowSize}
      maxToRenderPerBatch={maxToRenderPerBatch}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getItem || getItemData}
      {...rest}
    />
  );
}

export default memo(VirtualizedListComponent, isEqual);
