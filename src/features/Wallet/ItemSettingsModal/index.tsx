import { memo } from 'react';
import { ModalComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import isEqual from 'react-fast-compare';
import { Alert, View } from 'react-native';
import styles from './styles';
import { TAccount } from 'types/models';
import { useAppDispatch } from 'store/index';
import { deactivateAccountById, deleteAccountById } from 'store/account/account.slice';
import { useNavigation } from '@react-navigation/native';
import { ADDWALLET } from 'navigation/constants';

type ItemSettingsModalProps = IModalComponentProps & { account?: TAccount };

const TRANSFER = 'transfer';
const ADJUSTMENT = 'adjustment';
const EDIT = 'edit';
const DELETE = 'delete';
const INACTIVE = 'inactive';

function ItemSettingsModal({ isVisible, onToggleModal, account }: ItemSettingsModalProps) {
  const useDispatch = useAppDispatch();
  const navigation = useNavigation();
  const isAccountActive = account?.is_active;

  const onItemPress = (type: string) => {
    switch (type) {
      case TRANSFER:
        break;
      case ADJUSTMENT:
        break;
      case EDIT:
        navigation.navigate(ADDWALLET, { accountId: account?._id });
        break;
      case DELETE:
        onConfirmDelete();
        break;
      default:
        if (account) {
          useDispatch(
            deactivateAccountById({ id: account._id, changes: { is_active: !account.is_active } }),
          );
        }
        break;
    }
    if (type !== DELETE) onToggleModal();
  };

  const onOk = () => {
    account?._id && useDispatch(deleteAccountById(account._id));
  };

  const onConfirmDelete = () =>
    Alert.alert(
      `Xóa ${account?.name}`,
      'Xóa tài khoản đồng này nghĩa với việc tất cả các ghi chép của tài khoản này sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', style: 'destructive', onPress: () => onOk() },
      ],
    );

  return (
    <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal}>
      <View>
        <TouchableHighlightComponent
          onPress={() => onItemPress(TRANSFER)}
          isActive={isAccountActive}
        >
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={18} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(ADJUSTMENT)}
          isActive={isAccountActive}
        >
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={18} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(EDIT)} isActive={isAccountActive}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={18} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(DELETE)} isActive={isAccountActive}>
          <View style={styles.item}>
            <SvgIcon name="trash" size={18} />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(INACTIVE)}>
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
