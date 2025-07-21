import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from 'components/Modal';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import SvgIcon from 'components/SvgIcon';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import { changeAccountStatusById, requestDeleteAccount } from 'services/api/accounts';
import { TRANSACTION_TYPE } from 'utils/constants';
import { useAppDispatch } from 'store/index';
import { removeAccountStatement } from 'store/account/account.slice';
import { showToast } from 'utils/system';
import { TAccount } from 'database/types';
import styles from './styles';

const TRANSFER = 'transfer';
const ADJUSTMENT = 'adjustment';
const EDIT = 'edit';
const DELETE = 'delete';
const INACTIVE = 'inactive';

function ItemSettingsModal({
  isShowModal,
  currentAccount,
  onToggleModal,
  onRefresh,
}: {
  isShowModal: boolean;
  onToggleModal: () => void;
  onRefresh: () => void;
  currentAccount: TAccount;
}) {
  const navigation = useNavigation<any>();
  const isDisabledAction = !currentAccount?.isActive;
  const dispatch = useAppDispatch();

  const onOk = () => {
    if (currentAccount.id) {
      requestDeleteAccount(currentAccount.id)
        .then(() => {
          dispatch(removeAccountStatement(currentAccount.id));
          onToggleModal();
          onRefresh();
          showToast({
            type: 'success',
            text2: 'Xóa tài khoản thành công',
          });
        })
        .catch(({ error }) => {
          showToast({
            type: 'error',
            text2: error,
          });
        });
    }
  };

  const onConfirmDelete = () =>
    Alert.alert(
      `Xóa ${currentAccount?.accountName}`,
      'Xóa tài khoản đồng này nghĩa với việc tất cả các ghi chép của tài khoản này và các tài khoản liên quan sẽ bị xóa theo, HÃY CẨN THẬN!',
      [
        {
          text: 'Hủy bỏ',
          style: 'cancel',
        },
        { text: 'Đồng ý', style: 'destructive', onPress: () => onOk() },
      ],
    );

  const onItemPress = (type: string) => {
    switch (type) {
      case TRANSFER:
        navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
          accountId: currentAccount?.id,
          transactionType: TRANSACTION_TYPE.TRANSFER,
        });
        break;
      case ADJUSTMENT:
        navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
          accountId: currentAccount?.id,
          transactionType: TRANSACTION_TYPE.ADJUSTMENT,
        });
        break;
      case EDIT:
        navigation.navigate(ROUTES.ADD_ACCOUNT, { accountId: currentAccount?.id });
        break;
      case DELETE:
        onConfirmDelete();
        break;
      default:
        if (currentAccount?.id) {
          changeAccountStatusById(currentAccount.id).then(() => onRefresh());
        }
        break;
    }
    if (type !== DELETE) onToggleModal();
  };

  return (
    <ModalComponent
      isVisible={isShowModal}
      onToggleModal={onToggleModal}
      styleDefaultContent={{ padding: 5 }}
    >
      <View>
        <TouchableHighlightComponent
          onPress={() => onItemPress(TRANSFER)}
          isDisable={isDisabledAction}
        >
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={22} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(ADJUSTMENT)}
          isDisable={isDisabledAction}
        >
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={22} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(EDIT)} isDisable={isDisabledAction}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={22} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(INACTIVE)}>
          <View style={styles.item}>
            <SvgIcon name={isDisabledAction ? 'lockOpen' : 'lock'} size={22} color="red" />
            <RNText>{isDisabledAction ? 'Tái sử dụng' : 'Ngừng sử dụng'}</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(DELETE)}
          isDisable={isDisabledAction}
        >
          <View style={styles.item}>
            <SvgIcon name="trash" size={22} color="red" />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
      </View>
    </ModalComponent>
  );
}

export default ItemSettingsModal;
