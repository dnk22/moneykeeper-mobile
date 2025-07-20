import { useState } from 'react';
import InputSelection from 'components/InputSelection';
import { useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPE_LIST, ACCOUNT_TYPE_LOGO } from 'utils/constants/account';
import { TAccountType } from 'database/types';
import { CommonActions, useNavigation } from '@react-navigation/native';
import ModalComponent from 'components/Modal';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNText from 'components/Text';
import CheckboxComponent from 'components/Checkbox';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';

function AccountTypeSelect({
  accountTypeId,
  accountWithoutBank,
}: {
  accountTypeId: number;
  accountWithoutBank: any[];
}) {
  const { colors } = useCustomTheme();
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

  // Memoize renderItem to prevent recreating on every render
  const renderItem = ({ item }: { item: TAccountType }) => {
    const isItemSelected = item.id === currentAccountType.id;

    return (
      <TouchableHighlightComponent onPress={() => handleItemPress(item)} key={item.name}>
        <View style={[styles.item, isItemSelected && { backgroundColor: colors.background }]}>
          <View style={styles.itemContent}>
            <FastImage source={ACCOUNT_TYPE_LOGO[item.icon]} style={styles.itemIcon} />
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
        icon={ACCOUNT_TYPE_LOGO[currentAccountType.icon]}
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
