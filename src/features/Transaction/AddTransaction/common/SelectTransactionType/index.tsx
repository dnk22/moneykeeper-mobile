import React, { useState } from 'react';
import { RNText, PressableHaptic } from 'components/index';
import TransactionTypePicker from './TransactionTypePicker';
import { TRANSACTION_TYPE } from 'utils/constant';
import { TransactionTypeData } from 'utils/data';
import { TTransactionType } from 'utils/types';
import styles from './styles';

type SelectTransactionTypeProps = {
  currentIndex: any;
  onItemPress: (item: TTransactionType) => void;
};

function SelectTransactionType({ currentIndex, onItemPress }: SelectTransactionTypeProps) {
  const [isShowTransactionTypeModal, setIsShowTransactionTypeModal] = useState(false);

  const onToggleTransactionTypeModal = () => {
    setIsShowTransactionTypeModal(!isShowTransactionTypeModal);
  };

  const onHandleTransactionTypeItemPress = (item: TTransactionType) => {
    onItemPress(item);
    onToggleTransactionTypeModal();
  };

  return (
    <>
      <TransactionTypePicker
        data={TransactionTypeData}
        isVisible={isShowTransactionTypeModal}
        isTypeSelected={currentIndex}
        onToggleModal={onToggleTransactionTypeModal}
        onPressItem={onHandleTransactionTypeItemPress}
      />
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{TransactionTypeData[+currentIndex]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
