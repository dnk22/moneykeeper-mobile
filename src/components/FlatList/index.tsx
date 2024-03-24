import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { PropsFlatList } from './model';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';

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

  const keyExtractor = useCallback((item: any) => (id === '' ? item : item[id]), []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
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
      ItemSeparatorComponent={({ highlighted }) => {
        return showSeparator ? (
          <View
            style={[
              { height: 0.8, width: '90%', backgroundColor: colors.divider, alignSelf: 'center' },
              highlighted,
            ]}
          />
        ) : undefined;
      }}
      {...rest}
    />
  );
};

export default memo(FlatListComponent, isEqual);
