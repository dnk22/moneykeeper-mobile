import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from 'components/Modal';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import { ROUTES } from 'navigation/constants/routes';
import { changeAccountStatusById, requestDeleteAccount } from 'services/api/accounts';
import { TRANSACTION_TYPE } from 'utils/constants';
import { showToast } from 'utils/system';
import { TAccount } from 'database/types';
import { CardEdit, Lock1, Unlock, Math, MoneySend, Trash } from 'iconsax-react-native';
import { useCustomTheme } from 'resources/theme';
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
  const { colors } = useCustomTheme();
  const navigation = useNavigation<any>();
  const isDisabledAction = !currentAccount?.isActive;

  const onOk = () => {
    if (currentAccount.id) {
      requestDeleteAccount(currentAccount.id)
        .then(() => {
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
            text2: 'Vui lòng thử lại',
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
          changeAccountStatusById(currentAccount)
            .then(() => onRefresh())
            .catch((error) => {
              showToast({
                type: 'error',
                text2: 'Vui lòng thử lại',
              });
            });
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
            <MoneySend size={28} color={colors.primary} variant="Broken" />
            <RNText>Chuyển khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(ADJUSTMENT)}
          isDisable={isDisabledAction}
        >
          <View style={styles.item}>
            <Math size="28" color={colors.primary} variant="Broken" />
            <RNText>Điều chỉnh số dư tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(EDIT)} isDisable={isDisabledAction}>
          <View style={styles.item}>
            <CardEdit size="28" color={colors.primary} variant="Broken" />
            <RNText>Sửa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent onPress={() => onItemPress(INACTIVE)}>
          <View style={styles.item}>
            {isDisabledAction ? (
              <Unlock size="28" color={colors.primary} variant="Broken" />
            ) : (
              <Lock1 size="28" color={colors.error} variant="Broken" />
            )}
            <RNText>{isDisabledAction ? 'Tái sử dụng' : 'Ngừng sử dụng'}</RNText>
          </View>
        </TouchableHighlightComponent>
        <TouchableHighlightComponent
          onPress={() => onItemPress(DELETE)}
          isDisable={isDisabledAction}
        >
          <View style={styles.item}>
            <Trash size="28" color={colors.error} variant="Broken" />
            <RNText>Xóa tài khoản</RNText>
          </View>
        </TouchableHighlightComponent>
      </View>
    </ModalComponent>
  );
}

export default ItemSettingsModal;
