import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  CheckboxComponent,
  FlatListComponent,
  ModalComponent,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import styles from './style';
import { TTransactionType } from 'database/types/index';
import { TRANSACTION_TYPE } from 'utils/constant';

interface TransactionTypePickerProps extends IModalComponentProps {
  data: TTransactionType[];
  onPressItem: (item: TTransactionType) => void;
  isTypeSelected?: TRANSACTION_TYPE;
}

function TransactionTypePicker({
  data,
  isTypeSelected = TRANSACTION_TYPE.EXPENSE,
  onPressItem,
  isVisible,
  onToggleModal,
}: TransactionTypePickerProps) {
  const [isSelected, setIsSelected] = useState<TRANSACTION_TYPE>(isTypeSelected);

  useEffect(() => {
    setIsSelected(isTypeSelected);
  }, [isTypeSelected]);

  const currentSelected = (itemId: TRANSACTION_TYPE) => +isSelected === +itemId;

  function renderItem({ item }: { item: TTransactionType }) {
    const onPress = () => {
      setIsSelected(item.id);
      onPressItem(item);
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

export default TransactionTypePicker;
