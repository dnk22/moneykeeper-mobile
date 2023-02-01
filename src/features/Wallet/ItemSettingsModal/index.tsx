import { memo } from 'react';
import { ModalComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import isEqual from 'react-fast-compare';
import { Alert, View } from 'react-native';
import styles from './styles';
import { TAccount } from 'types/models';
import { useAppDispatch } from 'store/index';
import { deactivateAccountById, deleteAccountById } from 'store/account/account.slice';

type ItemSettingsModalProps = IModalComponentProps & { account?: TAccount };

function ItemSettingsModal({ isVisible, onToggleModal, account }: ItemSettingsModalProps) {
  const useDispatch = useAppDispatch();
  const isAccountActive = account?.is_active;

  const onItemPress = (type: string) => {
    switch (type) {
      case 'transfer':
        break;
      case 'adjustment':
        break;
      case 'edit':
        break;
      case 'delete':
        onConfirmDelete();
        break;
      default:
        if (account) {
          useDispatch(deactivateAccountById({ ...account, is_active: !account.is_active }));
        }
        onToggleModal();
        break;
    }
  };

  const onOk = () => {
    account?._id && useDispatch(deleteAccountById(account._id));
    onToggleModal();
  };

  const onConfirmDelete = () =>
    Alert.alert(
      `Xóa ${account?.name}`,
      'Xóa tài khoản đồng nghĩa với việc tất cả các ghi chép của tài khoản này sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', onPress: () => onOk() },
      ],
    );

  return (
    <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal}>
      <View>
        <TouchableHighlightComponent
          onPress={() => onItemPress('transfer')}
          isActive={isAccountActive}
        >
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={18} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress('adjustment')}
          isActive={isAccountActive}
        >
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={18} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('edit')} isActive={isAccountActive}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={18} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress('delete')}
          isActive={isAccountActive}
        >
          <View style={styles.item}>
            <SvgIcon name="trash" size={18} />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress('inactive')}>
          <View style={styles.item}>
            <SvgIcon name={isAccountActive ? 'lock' : 'lockOpen'} size={18} />
            <RNText>{isAccountActive ? 'Ngưng sử dụng' : 'Tái sử dụng'}</RNText>
          </View>
        </TouchableHighlightComponent>
      </View>
    </ModalComponent>
  );
}

export default memo(ItemSettingsModal, isEqual);
