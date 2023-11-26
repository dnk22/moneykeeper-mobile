import { ModalComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { Alert, View } from 'react-native';
import { TAccount } from 'database/types/index';
import { useNavigation } from '@react-navigation/native';
import { ADD_ACCOUNT } from 'navigation/constants';
import { changeAccountStatusById, deleteAccountById } from 'services/api/accounts';
import styles from './styles';

type ItemSettingsModalProps = IModalComponentProps & { account: TAccount; onActionPressDone?: any };

const TRANSFER = 'transfer';
const ADJUSTMENT = 'adjustment';
const EDIT = 'edit';
const DELETE = 'delete';
const INACTIVE = 'inactive';

function ItemSettingsModal({
  isVisible,
  onToggleModal,
  account,
  onActionPressDone,
}: ItemSettingsModalProps) {
  const navigation = useNavigation<any>();
  const isAccountDisable = !account?.isActive;

  const onItemPress = (type: string) => {
    switch (type) {
      case TRANSFER:
        break;
      case ADJUSTMENT:
        break;
      case EDIT:
        navigation.navigate(ADD_ACCOUNT, { accountId: account.id });
        break;
      case DELETE:
        onConfirmDelete();
        break;
      default:
        if (account) {
          changeAccountStatusById(account.id).then(() => onActionPressDone());
        }
        break;
    }
    if (type !== DELETE) onToggleModal();
  };

  const onOk = () => {
    account?.id &&
      deleteAccountById(account.id).then(() => {
        onToggleModal();
        onActionPressDone();
      });
  };

  const onConfirmDelete = () =>
    Alert.alert(
      `Xóa ${account?.accountName}`,
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
          isDisable={isAccountDisable}
        >
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={18} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(ADJUSTMENT)}
          isDisable={isAccountDisable}
        >
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={18} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(EDIT)} isDisable={isAccountDisable}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={18} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(DELETE)}
          isDisable={isAccountDisable}
        >
          <View style={styles.item}>
            <SvgIcon name="trash" size={18} color="red" />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(INACTIVE)}>
          <View style={styles.item}>
            <SvgIcon name={isAccountDisable ? 'lockOpen' : 'lock'} size={18} color="red" />
            <RNText>{isAccountDisable ? 'Tái sử dụng' : 'Ngưng sử dụng'}</RNText>
          </View>
        </TouchableHighlightComponent>
      </View>
    </ModalComponent>
  );
}

export default ItemSettingsModal;
