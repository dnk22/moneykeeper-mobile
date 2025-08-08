import { useState } from 'react';
import InputSelection from 'components/InputSelection';
import { useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import { TAccountType } from 'database/types';
import ModalComponent from 'components/Modal';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { View } from 'react-native';
import RNText from 'components/Text';
import CheckboxComponent from 'components/Checkbox';
import { useCustomTheme } from 'resources/theme';
import ImageComponent from 'components/ImageComponent';
import styles from './styles';

const BANK_ACCOUNT_TYPE = [ACCOUNT_TYPE_LIST[1].id, ACCOUNT_TYPE_LIST[2].id];

function AccountTypeSelect({ accountTypeId }: { accountTypeId: number }) {
  const { colors } = useCustomTheme();
  const [isVisible, toggle] = useState(false);
  const formMethods = useFormContext();
  const { setValue, getValues } = formMethods;

  const currentAccountType = ACCOUNT_TYPE_LIST[accountTypeId];

  const onToggleModal = () => {
    toggle(!isVisible);
  };

  const handleItemPress = (item: TAccountType) => {
    onToggleModal();
    if (item.id !== accountTypeId) {
      setValue('accountTypeId', item.id);
      // TH: nếu next accountType và currentAccount thuộc bank thì không xóa bankId, accountLogo
      if (
        BANK_ACCOUNT_TYPE.includes(item.id) &&
        BANK_ACCOUNT_TYPE.includes(accountTypeId) &&
        getValues('bankId')
      ) {
        return;
      }
      setValue('bankId', '');
      setValue('accountLogo', item.icon);
    }
  };

  // Memoize renderItem to prevent recreating on every render
  const renderItem = ({ item }: { item: TAccountType }) => {
    const isItemSelected = item.id === currentAccountType.id;

    return (
      <TouchableHighlightComponent onPress={() => handleItemPress(item)} key={item.name}>
        <View style={[styles.item, isItemSelected && { backgroundColor: colors.background }]}>
          <View style={styles.itemContent}>
            <ImageComponent name={item.icon} size={28} />
            <RNText>{item.name}</RNText>
          </View>
          {isItemSelected && <CheckboxComponent check disabled color={colors.primaryVariant} />}
        </View>
      </TouchableHighlightComponent>
    );
  };

  return (
    <>
      <InputSelection
        required
        fieldName="accountTypeId"
        iconName={currentAccountType.icon}
        displayValue={currentAccountType.name}
        onSelect={onToggleModal}
      />
      <ModalComponent
        isVisible={isVisible}
        onToggleModal={onToggleModal}
        title="Chọn loại tài khoản"
      >
        {ACCOUNT_TYPE_LIST.map((item) => renderItem({ item }))}
      </ModalComponent>
    </>
  );
}
export default AccountTypeSelect;
