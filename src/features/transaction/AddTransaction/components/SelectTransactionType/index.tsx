import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import ImageComponent from 'components/ImageComponent';
import CheckboxComponent from 'components/Checkbox';
import PressableHaptic from 'components/PressableHaptic';
import FlatListComponent from 'components/FlatList';
import RNText from 'components/Text';
import ModalComponent from 'components/Modal';
import { TRANSACTION_TYPE_DATA } from 'utils/constants/transactions';
import { TTransactionType } from 'utils/types/request.type';
import { TRANSACTION_LEND_BORROW_NAME, TRANSACTION_TYPE } from 'utils/constants';
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

  const onHandleTransactionTypeItemPress = (item: TTransactionType) => {
    if (prevActive.current !== +item.id) {
      prevActive.current = +item.id;
      setIsActive(item.id);
      onItemPress(item);
    }
    onToggleTransactionTypeModal();
  };

  function renderItem({ item, index }: { item: TTransactionType; index: number }) {
    if (
      isEditMode &&
      currentType !== TRANSACTION_TYPE.ADJUSTMENT &&
      index === +TRANSACTION_TYPE_DATA[TRANSACTION_TYPE_DATA.length - 1].id
    ) {
      return <></>;
    }

    return (
      <TouchableHighlightComponent onPress={() => onHandleTransactionTypeItemPress(item)}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.itemIcon}>
              <ImageComponent name={item.icon} />
            </View>
            <RNText>{item.name}</RNText>
          </View>
          <CheckboxComponent
            check={+isActive === +item.id}
            onPress={() => onHandleTransactionTypeItemPress(item)}
          />
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
          data={TRANSACTION_TYPE_DATA}
          renderItem={renderItem}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
        />
      </ModalComponent>
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{TRANSACTION_TYPE_DATA[+isActive]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
