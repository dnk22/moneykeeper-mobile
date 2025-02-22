import { memo, useCallback } from 'react';
import { VirtualizedList, VirtualizedListProps } from 'react-native';
import isEqual from 'react-fast-compare';

type VirtualizedListComponentProps = VirtualizedListProps<any> & { id?: string };

function VirtualizedListComponent({
  id = 'id',
  data = [],
  getItem,
  renderItem,
  windowSize = 17,
  maxToRenderPerBatch = 10,
  initialNumToRender = 6,
  ...rest
}: VirtualizedListComponentProps) {
  const keyExtractor = useCallback((item: any) => item?.[id] ?? String(Math.random()), [id]);

  const getItemData = useCallback((_data: unknown[], index: number): any => _data[index], []);

  const getItemCount = useCallback((_data: unknown[]) => _data?.length ?? 0, []);

  return (
    <VirtualizedList
      data={data}
      showsVerticalScrollIndicator={false}
      initialNumToRender={initialNumToRender}
      windowSize={windowSize}
      maxToRenderPerBatch={maxToRenderPerBatch}
      contentContainerStyle={{ gap: 10 }}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemCount={getItemCount}
      getItem={getItem ?? getItemData}
      {...rest}
    />
  );
}

export default memo(VirtualizedListComponent, isEqual);
