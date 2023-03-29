import { memo, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import {
  ModalComponent,
  CheckboxComponent,
  FlatListComponent,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import styles from './styles';
import { useAppSelector } from 'store/index';
import { selectAllAccountType } from 'store/account/account.selector';
import { TAccountType } from 'database/types';

type AccountTypeModalPickerProps = IModalComponentProps & {
  isItemSelected?: string;
  onPressItem?: (item: TAccountType) => void;
};

function AccountTypeModalPicker({
  isVisible,
  onToggleModal,
  isItemSelected,
  onPressItem,
}: AccountTypeModalPickerProps) {
  const accountTypeState = useAppSelector((state) => selectAllAccountType(state));

  const [isSelected, setIsSelected] = useState(isItemSelected);

  useEffect(() => {
    setIsSelected(isItemSelected);
  }, [isItemSelected]);

  const renderItem = ({ item }: { item: TAccountType }) => {
    const currentSelected = (itemId: string) => isSelected === itemId;
    const onPress = () => {
      if (onPressItem) {
        onPressItem(item);
      }
    };
    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} size={32} preset="transactionType" />
            <RNText>{item.name}</RNText>
          </View>
          {currentSelected(item.id) && <CheckboxComponent check disabled />}
        </View>
      </TouchableHighlightComponent>
    );
  };

  return (
    <ModalComponent
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onToggleModal={onToggleModal}
      title="Chọn loại tài khoản"
    >
      <FlatListComponent data={accountTypeState} renderItem={renderItem} />
    </ModalComponent>
  );
}
export default memo(AccountTypeModalPicker, isEqual);