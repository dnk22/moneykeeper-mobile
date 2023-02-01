import { memo } from 'react';
import { ModalComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import styles from './styles';

type ItemSettingsModalProps = IModalComponentProps & {};

function ItemSettingsModal({ isVisible, onToggleModal }: ItemSettingsModalProps) {
  const onItemPress = (type: string) => {};
  return (
    <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal}>
      <View>
        <TouchableHighlightComponent onPress={() => onItemPress('transfer')}>
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={18} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('adjustment')}>
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={18} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('edit')}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={18} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('delete')}>
          <View style={styles.item}>
            <SvgIcon name="trash" size={18} />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('inactive')}>
          <View style={styles.item}>
            <SvgIcon name="lock" size={18} />
            <RNText>Ngưng sử dụng</RNText>
          </View>
        </TouchableHighlightComponent>
      </View>
    </ModalComponent>
  );
}

export default memo(ItemSettingsModal, isEqual);
