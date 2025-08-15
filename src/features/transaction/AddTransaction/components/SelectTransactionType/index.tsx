import React, { Fragment, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import ImageComponent from 'components/ImageComponent';
import CheckboxComponent from 'components/Checkbox';
import PressableHaptic from 'components/PressableHaptic';
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
    onItemPress(item);
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
        animationIn="zoomIn"
        isVisible={isShowTransactionTypeModal}
        onToggleModal={onToggleTransactionTypeModal}
        styleDefaultContent={styles.modal}
      >
        <ScrollView>
          {TRANSACTION_TYPE_DATA.map((item, index) => {
            return <Fragment key={item.id}>{renderItem({ item, index })}</Fragment>;
          })}
        </ScrollView>
      </ModalComponent>
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{TRANSACTION_TYPE_DATA[+isActive]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
