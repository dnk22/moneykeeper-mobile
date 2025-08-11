import React, { useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import styles from './styles';

type FlatListComponentProps = FlashListProps<any> & {
  showSeparator?: boolean;
  gap?: number;
};

function FlatListComponent({
  contentContainerStyle,
  id = 'id',
  showSeparator,
  gap = 10,
  ...rest
}: FlatListComponentProps) {
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
    [showSeparator],
  );

  const keyExtractor = useCallback((item: any) => (id === '' ? item : item[id]), [id]);

  return (
    <FlashList
      keyExtractor={keyExtractor}
      keyboardShouldPersistTaps="handled"
      onEndReachedThreshold={0.5}
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={renderSeparator}
      {...rest}
    />
  );
}

export default FlatListComponent;
