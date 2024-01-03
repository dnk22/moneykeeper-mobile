import { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import {
  ModalComponent,
  CheckboxComponent,
  FlatListComponent,
  RNText,
  TouchableHighlightComponent,
  IconComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { TAccountType } from 'database/types';
import { AccountType } from 'utils/data';
import styles from './styles';

type AccountTypeModalPickerProps = IModalComponentProps & {
  idSelected?: string;
  onPressItem?: (item: TAccountType) => void;
};

function AccountTypeModalPicker({
  isVisible,
  onToggleModal,
  idSelected,
  onPressItem,
}: AccountTypeModalPickerProps) {
  const [isSelected, setIsSelected] = useState(idSelected);

  useEffect(() => {
    setIsSelected(idSelected);
  }, [idSelected]);

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
            <IconComponent name={item.icon} />
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
      <FlatListComponent data={AccountType} renderItem={renderItem} />
    </ModalComponent>
  );
}
export default memo(AccountTypeModalPicker, isEqual);
