import { useCallback, memo, useMemo } from 'react';
import { RefreshControl, SectionList, SectionListProps } from 'react-native';
import isEqual from 'react-fast-compare';

export type TSectionListProps = SectionListProps<any> & {
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasPull?: boolean;
  id?: string;
};

function SectionListComponent({
  sections,
  renderItem,
  renderSectionHeader,
  stickySectionHeadersEnabled = false,
  onRefresh,
  onLoadMore,
  maxToRenderPerBatch = 10,
  initialNumToRender = 10,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  refreshing,
  hasPull = false,
  id = 'id',
  ...rest
}: TSectionListProps) {
  const keyExtractor = useCallback((item: any) => (id === '' ? item : item[id]), []);

  const renderRefreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing || false}
        onRefresh={() => {
          onRefresh && onRefresh();
        }}
      />
    ),
    [onRefresh],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      extraData={sections}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshControl={hasPull ? renderRefreshControl : undefined}
      onEndReachedThreshold={0.5}
      onEndReached={() => onLoadMore && onLoadMore()}
      maxToRenderPerBatch={maxToRenderPerBatch}
      initialNumToRender={initialNumToRender}
      {...rest}
    />
  );
}

export default memo(SectionListComponent, isEqual);
