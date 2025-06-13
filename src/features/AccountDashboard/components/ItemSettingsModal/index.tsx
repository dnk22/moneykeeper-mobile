import { useContext } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import { changeAccountStatusById, requestDeleteAccount } from 'services/api/accounts';
import { TRANSACTION_TYPE } from 'utils/constants';
import { useAppDispatch } from 'store/index';
import { removeAccountStatement } from 'store/account/account.slice';
import { showToast } from 'utils/system';
import ModalComponent from 'components/Modal';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import SvgIcon from 'components/SvgIcon';
import RNText from 'components/Text';
import { AccountContext } from 'features/AccountDashboard/context';
import styles from './styles';

const TRANSFER = 'transfer';
const ADJUSTMENT = 'adjustment';
const EDIT = 'edit';
const DELETE = 'delete';
const INACTIVE = 'inactive';

function ItemSettingsModal() {
  const navigation = useNavigation<any>();
  const {
    accountPressed: account,
    isShowModal,
    onToggleModal,
    getAccounts,
  } = useContext(AccountContext);
  const isAccountDisable = !account?.isActive;
  const dispatch = useAppDispatch();

  const onOk = () => {
    if (account?.id) {
      requestDeleteAccount(account.id)
        .then(() => {
          dispatch(removeAccountStatement(account.id));
          onToggleModal();
          getAccounts();
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
      `Xóa ${account?.accountName}`,
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
          accountId: account?.id,
          transactionType: TRANSACTION_TYPE.TRANSFER,
        });
        break;
      case ADJUSTMENT:
        navigation.navigate(ROUTES.CREATE_TRANSACTION_FROM_ACCOUNT, {
          accountId: account?.id,
          transactionType: TRANSACTION_TYPE.ADJUSTMENT,
        });
        break;
      case EDIT:
        navigation.navigate(ROUTES.ADD_ACCOUNT, { accountId: account?.id });
        break;
      case DELETE:
        onConfirmDelete();
        break;
      default:
        if (account?.id) {
          changeAccountStatusById(account.id).then(() => getAccounts());
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
          isDisable={isAccountDisable}
        >
          <View style={styles.item}>
            <SvgIcon name="trayUp" size={22} />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(ADJUSTMENT)}
          isDisable={isAccountDisable}
        >
          <View style={styles.item}>
            <SvgIcon name="plusMinus" size={22} />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(EDIT)} isDisable={isAccountDisable}>
          <View style={styles.item}>
            <SvgIcon name="pencil" size={22} />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(INACTIVE)}>
          <View style={styles.item}>
            <SvgIcon name={isAccountDisable ? 'lockOpen' : 'lock'} size={22} color="red" />
            <RNText>{isAccountDisable ? 'Tái sử dụng' : 'Ngừng sử dụng'}</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(DELETE)}
          isDisable={isAccountDisable}
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
