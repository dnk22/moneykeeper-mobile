import React, { memo, useState } from 'react';
import { Image, View } from 'react-native';
import {
  CheckboxComponent,
  FlatListComponent,
  ModalComponent,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import isEqual from 'react-fast-compare';
import styles from './style';
import { TTransactionType } from 'database/types/index';

interface TransactionTypePickerProps extends IModalComponentProps {
  data: TTransactionType[];
  onPressItem?: (item: TTransactionType) => void;
  isTypeSelected?: string;
}

function TransactionTypePicker({
  data,
  isTypeSelected = '',
  onPressItem,
  isVisible,
  onToggleModal,
}: TransactionTypePickerProps) {
  const [isSelected, setIsSelected] = useState(isTypeSelected);

  const currentSelected = (itemId: string) => isSelected === itemId;

  function renderItem({ item }: { item: TTransactionType }) {
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
              <SvgIcon name={item.icon} size={24} />
            </View>
            <RNText>{item.name}</RNText>
          </View>
          <CheckboxComponent check={currentSelected(item.id)} disabled />
        </View>
      </TouchableHighlightComponent>
    );
  }
  return (
    <ModalComponent
      isVisible={isVisible}
      onToggleModal={onToggleModal}
      animationIn="zoomIn"
      styleDefaultContent={styles.modal}
    >
      <FlatListComponent
        data={data}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
    </ModalComponent>
  );
}

export default memo(TransactionTypePicker, isEqual);
