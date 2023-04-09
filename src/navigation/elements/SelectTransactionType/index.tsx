import { useState } from 'react';
import { RNText, PressableHaptic } from 'components/index';
import { TTransactionType } from 'database/types';
import { useAppSelector } from 'store/index';
import TransactionTypePicker from './TransactionTypePicker';
import { selectTransactionType } from 'store/transactions/transactions.selector';
import styles from './styles';
import { TRANSACTION_TYPE } from 'utils/constant';

type SelectTransactionTypeProps = {
  isSelected: TRANSACTION_TYPE;
  onItemPress: (item: TRANSACTION_TYPE) => void;
};
function SelectTransactionType({
  isSelected = TRANSACTION_TYPE.EXPENSE,
  onItemPress,
}: SelectTransactionTypeProps) {
  const transactionType = useAppSelector((state) => selectTransactionType(state));
  const [isShowTransactionTypeModal, setIsShowTransactionTypeModal] = useState(false);

  const onToggleTransactionTypeModal = () => {
    setIsShowTransactionTypeModal(!isShowTransactionTypeModal);
  };

  const onHandleTransactionTypeItemPress = ({ id }: TTransactionType) => {
    onItemPress(id);
    onToggleTransactionTypeModal();
  };

  return (
    <>
      <TransactionTypePicker
        data={transactionType}
        isVisible={isShowTransactionTypeModal}
        isTypeSelected={isSelected}
        onToggleModal={onToggleTransactionTypeModal}
        onPressItem={onHandleTransactionTypeItemPress}
      />
      <PressableHaptic style={styles.transactionTypePicker} onPress={onToggleTransactionTypeModal}>
        <RNText color="white">{transactionType[+isSelected]?.name}</RNText>
      </PressableHaptic>
    </>
  );
}

export default SelectTransactionType;
