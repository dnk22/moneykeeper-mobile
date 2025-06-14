import { useState } from 'react';
import InputSelection from 'components/InputSelection';
import { useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPE_LIST, ACCOUNT_TYPE_LOGO } from 'utils/constants/account';
import { TAccountType } from 'database/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AccountTypeModalPicker from './ModalPicker';

function AccountTypeSelect({
  accountTypeId,
  accountWithoutBank,
}: {
  accountTypeId: number;
  accountWithoutBank: any[];
}) {
  const [isVisible, toggle] = useState(false);
  const navigation = useNavigation<any>();
  const formMethods = useFormContext();
  const { setValue } = formMethods;

  const currentAccountType = ACCOUNT_TYPE_LIST[accountTypeId];

  const onToggleModal = () => {
    toggle(!isVisible);
  };

  const handleItemPress = (item: TAccountType) => {
    if (item.id !== accountTypeId) {
      if (accountWithoutBank.includes(item.id)) {
        navigation.dispatch({
          ...CommonActions.setParams({ bankId: '' }),
        });
        setValue('bankId', '');
      }
      setValue('accountTypeId', item.id);
      setValue('accountTypeName', item.name);
      setValue('accountLogo', item.icon);
    }
    onToggleModal();
  };

  return (
    <>
      <AccountTypeModalPicker
        isVisible={isVisible}
        idSelected={accountTypeId}
        onToggleModal={onToggleModal}
        onPressItem={handleItemPress}
      />
      <InputSelection
        required
        fieldName="accountTypeId"
        formMethods={formMethods}
        icon={ACCOUNT_TYPE_LOGO[currentAccountType.icon]}
        displayValue={currentAccountType.name}
        onSelect={onToggleModal}
      />
    </>
  );
}
export default AccountTypeSelect;
