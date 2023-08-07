import { useEffect, useState } from 'react';
import InputSelection from 'components/InputSelection';
import { TAccountType } from 'database/types';
import AccountTypeModalPicker from '../AccountTypeModalPicker';

function AccountTypeSelect({
  value,
  onValueChange,
}: {
  value: TAccountType;
  onValueChange: (value: TAccountType) => void;
}) {
  const [accountTypeSelected, setAccountTypeSelected] = useState<TAccountType>(value);
  const [isShowAccountTypeModal, setIsShowAccountTypeModal] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setAccountTypeSelected(value);
    }
  }, [value]);

  /** open account type modal */
  const onSelectAccountType = () => {
    setIsShowAccountTypeModal(true);
  };

  const onCloseModal = () => {
    setIsShowAccountTypeModal(false);
  };

  const handleOnItemModalPress = (item: TAccountType) => {
    setIsShowAccountTypeModal(false);
    if (item.id !== accountTypeSelected.id) {
      setAccountTypeSelected(item);
      onValueChange(item);
    }
  };

  return (
    <>
      <AccountTypeModalPicker
        isVisible={isShowAccountTypeModal}
        idSelected={accountTypeSelected.id}
        onToggleModal={onCloseModal}
        onPressItem={handleOnItemModalPress}
      />
      <InputSelection
        required
        icon={accountTypeSelected?.icon}
        value={accountTypeSelected?.name}
        onSelect={onSelectAccountType}
      />
    </>
  );
}
export default AccountTypeSelect;
