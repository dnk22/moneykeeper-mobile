import { memo, useCallback } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import { TAccountType } from 'database/types';
import { ACCOUNT_TYPE_LIST, ACCOUNT_TYPE_LOGO } from 'utils/constants/account';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import ModalComponent from 'components/Modal';
import CheckboxComponent from 'components/Checkbox';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import FastImage from 'react-native-fast-image';

type AccountTypeModalPickerProps = {
  isVisible: boolean;
  idSelected?: any;
  onToggleModal: () => void;
  onPressItem?: (item: TAccountType) => void;
};

function AccountTypeModalPicker({
  isVisible,
  idSelected,
  onToggleModal,
  onPressItem,
}: AccountTypeModalPickerProps) {
  const { colors } = useCustomTheme();
  // Memoize renderItem to prevent recreating on every render
  const renderItem = useCallback(
    ({ item }: { item: TAccountType }) => {
      const isItemSelected = item.id === idSelected;

      const handlePress = () => {
        onPressItem?.(item);
      };

      return (
        <TouchableHighlightComponent onPress={handlePress} key={item.name}>
          <View style={[styles.item, isItemSelected && { backgroundColor: colors.background }]}>
            <View style={styles.itemContent}>
              <FastImage source={ACCOUNT_TYPE_LOGO[item.icon]} style={styles.itemIcon} />
              <RNText>{item.name}</RNText>
            </View>
            {isItemSelected && <CheckboxComponent check disabled color={colors.primaryVariant} />}
          </View>
        </TouchableHighlightComponent>
      );
    },
    [idSelected, onPressItem],
  );

  return (
    <ModalComponent
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onToggleModal={onToggleModal}
      title="Chọn loại tài khoản"
    >
      {ACCOUNT_TYPE_LIST.map((item) => renderItem({ item }))}
    </ModalComponent>
  );
}

export default memo(AccountTypeModalPicker, isEqual);
