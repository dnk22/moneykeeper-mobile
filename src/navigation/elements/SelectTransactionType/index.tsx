import { memo, useState } from 'react';
import { RNText, PressableHaptic } from 'components/index';
import { TTransactionType } from 'database/types';
import { useAppDispatch, useAppSelector } from 'store/index';
import TransactionTypePicker from './TransactionTypePicker';
import {
  selectTransactionType,
  selectTransactionTypeSelected,
} from 'store/transactions/transactions.selector';
import { setTransactionTypeIdSelected } from 'store/transactions/transactions.slice';
import styles from './styles';
import isEqual from 'react-fast-compare';

function SelectTransactionType() {
  const dispatch = useAppDispatch();
  const transactionType = useAppSelector((state) => selectTransactionType(state));
  const transactionTypeSelected = useAppSelector((state) => selectTransactionTypeSelected(state));
  const [isShowTransactionTypeModal, setIsShowTransactionTypeModal] = useState(false);

  const onToggleTransactionTypeModal = () => {
    setIsShowTransactionTypeModal(!isShowTransactionTypeModal);
  };

  const onHandleTransactionTypeItemPress = ({ id }: TTransactionType) => {
    dispatch(setTransactionTypeIdSelected(id));
    onToggleTransactionTypeModal();
  };

  return (
    <>
      <TransactionTypePicker
        data={transactionType}
        isVisible={isShowTransactionTypeModal}
        isTypeSelected={transactionTypeSelected}
        onToggleModal={onToggleTransactionTypeModal}
        onPressItem={onHandleTransactionTypeItemPress}
      />
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{transactionType[+transactionTypeSelected]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default memo(SelectTransactionType, isEqual);
