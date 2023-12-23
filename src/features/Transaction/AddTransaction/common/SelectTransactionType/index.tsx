import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  RNText,
  PressableHaptic,
  ModalComponent,
  FlatListComponent,
  TouchableHighlightComponent,
  SvgIcon,
  CheckboxComponent,
} from 'components/index';
import { TransactionTypeData } from 'utils/data';
import { TTransactionType } from 'utils/types';
import { TRANSACTION_LEND_BORROW_NAME } from 'utils/constant';
import styles from './styles';

type SelectTransactionTypeProps = {
  lendBorrowData: any;
  currentCategoryId?: string;
  currentType?: any;
  onItemPress: (item: TTransactionType) => void;
};

function SelectTransactionType({
  lendBorrowData,
  currentCategoryId,
  currentType,
  onItemPress,
}: SelectTransactionTypeProps) {
  const prevActive = useRef<any>(undefined);
  const [isActive, setIsActive] = useState<any>(0);
  const [isShowTransactionTypeModal, setIsShowTransactionTypeModal] = useState(false);

  const onToggleTransactionTypeModal = () => {
    setIsShowTransactionTypeModal(!isShowTransactionTypeModal);
  };

  useEffect(() => {
    if (currentCategoryId) {
      if (
        [TRANSACTION_LEND_BORROW_NAME.LEND, TRANSACTION_LEND_BORROW_NAME.BORROW].includes(
          lendBorrowData[currentCategoryId],
        )
      ) {
        setIsActive(currentType + 2);
      } else {
        setIsActive(currentType);
      }
    }
  }, [currentCategoryId, currentType]);

  function renderItem({ item }: { item: TTransactionType }) {
    const onHandleTransactionTypeItemPress = () => {
      if (prevActive.current !== +item.id) {
        prevActive.current = +item.id;
        setIsActive(item.id);
        onItemPress(item);
      }
      onToggleTransactionTypeModal();
    };

    return (
      <TouchableHighlightComponent onPress={onHandleTransactionTypeItemPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.itemIcon}>
              <SvgIcon name={item.icon} size={24} />
            </View>
            <RNText>{item.name}</RNText>
          </View>
          <CheckboxComponent check={+isActive === +item.id} disabled />
        </View>
      </TouchableHighlightComponent>
    );
  }
  return (
    <>
      <ModalComponent
        isVisible={isShowTransactionTypeModal}
        onToggleModal={onToggleTransactionTypeModal}
        animationIn="zoomIn"
        styleDefaultContent={styles.modal}
      >
        <FlatListComponent
          data={TransactionTypeData}
          renderItem={renderItem}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
        />
      </ModalComponent>
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{TransactionTypeData[+isActive]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
