import React, { memo, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { FlatListComponent, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { useCustomTheme } from 'resources/theme';
import isEqual from 'react-fast-compare';
import styles from './style';
import { TransactionTypePickerData } from './constants';
import { TTransactionType } from 'src/types/models';

interface TransactionTypePickerProps {
  onPressItem?: (item: TTransactionType) => void;
  isTypeSelected?: string;
  isShowCheckbox?: boolean;
}

function TransactionTypePicker({
  isTypeSelected = '',
  isShowCheckbox = true,
  onPressItem,
}: TransactionTypePickerProps) {
  const { colors } = useCustomTheme();
  const [isSelected, setIsSelected] = useState(isTypeSelected);

  const currentSelected = useCallback((itemId: string) => isSelected === itemId, [isSelected]);

  const renderItem = ({ item }: { item: TTransactionType }) => {
    const onPress = () => {
      setIsSelected(item._id);
      if (onPressItem) {
        onPressItem(item);
      }
    };

    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.itemIcon}>
              <SvgIcon name={item.icon} preset="transactionType" />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{item.name}</Text>
          </View>
          {(isShowCheckbox || currentSelected(item._id)) && (
            <View style={[styles.itemActive, { backgroundColor: colors.background }]}>
              {currentSelected(item._id) && <View style={styles.itemActiveBackground} />}
            </View>
          )}
        </View>
      </TouchableHighlightComponent>
    );
  };
  return (
    <View style={styles.container}>
      <FlatListComponent data={TransactionTypePickerData} renderItem={renderItem} />
    </View>
  );
}

export default memo(TransactionTypePicker, isEqual);
