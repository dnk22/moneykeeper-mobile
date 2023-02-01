import React, { useCallback, memo, useMemo } from 'react';
import { RefreshControl, SectionList } from 'react-native';
import { PropsSectionList } from './model';
import isEqual from 'react-fast-compare';

const FlatListComponent: PropsSectionList = (props) => {
  const {
    sections,
    renderItem,
    renderSectionHeader,
    onRefresh,
    onLoadMore,
    maxToRenderPerBatch = 10,
    initialNumToRender = 10,
    showsVerticalScrollIndicator = false,
    showsHorizontalScrollIndicator = false,
    refreshing,
    hasPull = false,
    ...rest
  } = props;

  const keyExtractor = useCallback((item: any) => item._id, []);

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
      // extraData={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshControl={hasPull ? renderRefreshControl : undefined}
      onEndReachedThreshold={0.5}
      onEndReached={() => onLoadMore && onLoadMore()}
      maxToRenderPerBatch={maxToRenderPerBatch}
      initialNumToRender={initialNumToRender}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...rest}
    />
  );
};

export default memo(FlatListComponent, isEqual);