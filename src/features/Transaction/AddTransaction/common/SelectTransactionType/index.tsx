import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  RNText,
  PressableHaptic,
  ModalComponent,
  FlatListComponent,
  TouchableHighlightComponent,
  CheckboxComponent,
  IconComponent,
} from 'components/index';
import { TransactionTypeData } from 'utils/data';
import { TTransactionType } from 'utils/types';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constant';
import styles from './styles';

type SelectTransactionTypeProps = {
  lendBorrowData: any;
  currentCategoryId?: string;
  currentType: TRANSACTION_TYPE;
  onItemPress: (item: TTransactionType) => void;
  isEditMode?: boolean;
};

function SelectTransactionType({
  lendBorrowData,
  currentCategoryId,
  currentType,
  onItemPress,
  isEditMode,
}: SelectTransactionTypeProps) {
  const prevActive = useRef<any>(undefined);
  const [isActive, setIsActive] = useState<any>(0);
  const [isShowTransactionTypeModal, setIsShowTransactionTypeModal] = useState(false);

  const onToggleTransactionTypeModal = () => {
    if (isEditMode && currentType === TRANSACTION_TYPE.ADJUSTMENT) {
      return;
    }
    setIsShowTransactionTypeModal(!isShowTransactionTypeModal);
  };

  useEffect(() => {
    if (
      (currentCategoryId &&
        [TRANSACTION_LEND_BORROW_NAME.LEND, TRANSACTION_LEND_BORROW_NAME.BORROW].includes(
          lendBorrowData[currentCategoryId],
        )) ||
      [TRANSACTION_TYPE.TRANSFER, TRANSACTION_TYPE.ADJUSTMENT].includes(currentType)
    ) {
      setIsActive(currentType + 2);
      return;
    }
    setIsActive(currentType);
  }, [currentCategoryId, currentType]);

  function renderItem({ item, index }: { item: TTransactionType }) {
    const onHandleTransactionTypeItemPress = () => {
      if (prevActive.current !== +item.id) {
        prevActive.current = +item.id;
        setIsActive(item.id);
        onItemPress(item);
      }
      onToggleTransactionTypeModal();
    };
    if (isEditMode && currentType !== TRANSACTION_TYPE.ADJUSTMENT && index === 5) {
      return <></>;
    }

    return (
      <TouchableHighlightComponent onPress={onHandleTransactionTypeItemPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.itemIcon}>
              <IconComponent name={item.icon} />
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
