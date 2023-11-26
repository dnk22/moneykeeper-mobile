import { useCallback, memo, useMemo } from 'react';
import { RefreshControl, SectionList, SectionListProps, View } from 'react-native';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';

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
  const { colors } = useCustomTheme();
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
      ItemSeparatorComponent={({ highlighted }) => (
        <View
          style={[
            { height: 0.4, width: '90%', backgroundColor: colors.divider, alignSelf: 'center' },
            highlighted,
          ]}
        />
      )}
      {...rest}
    />
  );
}

export default memo(SectionListComponent, isEqual);
