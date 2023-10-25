import React, { useState } from 'react';
import { RNText, PressableHaptic } from 'components/index';
import { TTransactionType } from 'database/types';
import TransactionTypePicker from './TransactionTypePicker';
import { TRANSACTION_TYPE } from 'utils/constant';
import { TransactionTypeData } from 'utils/data';
import styles from './styles';

type SelectTransactionTypeProps = {
  isSelected: TRANSACTION_TYPE;
  onItemPress: (item: TTransactionType) => void;
};

function SelectTransactionType({
  isSelected = TRANSACTION_TYPE.EXPENSE,
  onItemPress,
}: SelectTransactionTypeProps) {
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
        isTypeSelected={isSelected}
        onToggleModal={onToggleTransactionTypeModal}
        onPressItem={onHandleTransactionTypeItemPress}
      />
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{TransactionTypeData[+isSelected]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
