import React, { memo, useCallback, useState } from 'react';
import { Image, View } from 'react-native';
import {
  CheckboxComponent,
  FlatListComponent,
  ModalComponent,
  RNText,
  TouchableHighlightComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { useCustomTheme } from 'resources/theme';
import isEqual from 'react-fast-compare';
import styles from './style';
import { TransactionTypePickerData } from './constants';
import { TTransactionType } from 'database/types/index';

interface TransactionTypePickerProps extends IModalComponentProps {
  onPressItem?: (item: TTransactionType) => void;
  isTypeSelected?: string;
  isShowCheckbox?: boolean;
}

function TransactionTypePicker({
  isTypeSelected = '',
  isShowCheckbox = true,
  onPressItem,
  isVisible,
  onToggleModal,
}: TransactionTypePickerProps) {
  const { colors } = useCustomTheme();
  const [isSelected, setIsSelected] = useState(isTypeSelected);

  const currentSelected = useCallback((itemId: string) => isSelected === itemId, [isSelected]);

  const renderItem = ({ item }: { item: TTransactionType }) => {
    const onPress = () => {
      setIsSelected(item.id);
      if (onPressItem) {
        onPressItem(item);
      }
    };

    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.itemIcon}>
              <Image source={item.icon} style={{ width: 24, height: 24 }} />
            </View>
            <RNText>{item.name}</RNText>
          </View>
          {(isShowCheckbox || currentSelected(item.id)) && (
            <CheckboxComponent check={currentSelected(item.id)} />
          )}
        </View>
      </TouchableHighlightComponent>
    );
  };
  return (
    <ModalComponent
      isVisible={isVisible}
      onToggleModal={onToggleModal}
      animationIn="bounceIn"
      animationOut="bounceOut"
      styleDefaultContent={styles.modal}
    >
      <FlatListComponent data={TransactionTypePickerData} renderItem={renderItem} />
    </ModalComponent>
  );
}

export default memo(TransactionTypePicker, isEqual);
