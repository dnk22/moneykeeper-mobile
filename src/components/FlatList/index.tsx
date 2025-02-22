import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import isEqual from 'react-fast-compare';
import { PropsFlatList } from './model';

const FlatListComponent: PropsFlatList = ({
  data,
  renderItem,
  onRefresh,
  onLoadMore,
  maxToRenderPerBatch = 10,
  initialNumToRender = 10,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  refreshing,
  hasPull = false,
  id = 'id',
  showSeparator,
  ...rest
}) => {
  const { colors } = useCustomTheme();

  const onEndReached = useCallback(() => {
    if (onLoadMore) {
      onLoadMore();
    }
  }, [onLoadMore]);

  const renderRefreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing || false}
        onRefresh={() => {
          onRefresh && onRefresh();
        }}
      />
    ),
    [onRefresh, refreshing],
  );

  const keyExtractor = useCallback((item: any) => (id === '' ? item : item[id]), [id]);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      extraData={data}
      keyboardShouldPersistTaps="handled"
      renderItem={renderItem}
      refreshControl={hasPull ? renderRefreshControl : undefined}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      maxToRenderPerBatch={maxToRenderPerBatch}
      initialNumToRender={initialNumToRender}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={{ gap: 8 }}
      ItemSeparatorComponent={
        showSeparator
          ? () => (
              <View
                style={{
                  height: 0.8,
                  width: '95%',
                  backgroundColor: colors.divider,
                  alignSelf: 'center',
                }}
              />
            )
          : undefined
      }
      {...rest}
    />
  );
};

export default memo(FlatListComponent, isEqual);
