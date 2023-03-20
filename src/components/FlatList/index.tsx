import React, { memo, useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { PropsFlatList } from './model';
import isEqual from 'react-fast-compare';

const FlatListComponent: PropsFlatList = (props) => {
  const {
    data,
    renderItem,
    onRefresh,
    onLoadMore,
    keyExtractor,
    maxToRenderPerBatch = 10,
    initialNumToRender = 10,
    showsVerticalScrollIndicator = false,
    showsHorizontalScrollIndicator = false,
    refreshing,
    hasPull = false,
    ...rest
  } = props;
  const key = (item: any) => item.id;

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
    <FlatList
      data={data}
      keyExtractor={keyExtractor || key}
      extraData={data}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
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
