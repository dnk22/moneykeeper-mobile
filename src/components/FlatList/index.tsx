import React, { forwardRef, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import styles from './styles';

type FlatListComponentProps = FlashListProps<any> & {
  showSeparator?: boolean;
  gap?: number;
};

type FlashListRef = React.ElementRef<typeof FlashList>;

const FlatListComponent = forwardRef<FlashListRef, FlatListComponentProps>(
  (
    {
      contentContainerStyle,
      id = 'id',
      showSeparator,
      gap = 10,
      ...rest
    }: FlatListComponentProps,
    ref,
  ) => {
  const renderSeparator = useCallback(
    () =>
      showSeparator || gap ? (
        <View
          style={{
            height: gap,
          }}
        >
          {showSeparator && <View style={[styles.separator, { height: gap }]} />}
        </View>
      ) : undefined,
    [showSeparator, gap],
  );

  const keyExtractor = useCallback((item: any) => (id === '' ? item : item[id]), [id]);

  return (
    <FlashList
      ref={ref}
      keyExtractor={keyExtractor}
      keyboardShouldPersistTaps="handled"
      onEndReachedThreshold={0.5}
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={renderSeparator}
      {...rest}
    />
  );
  },
);

FlatListComponent.displayName = 'FlatListComponent';

export default FlatListComponent;
