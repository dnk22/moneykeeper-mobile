import { Alert, TouchableOpacity, View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import Loading from 'components/Loading';
import { BagCross } from 'iconsax-react-native';
import styles from './styles';

type FormActionProps = {
  isShowDelete?: boolean;
  onSubmit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
};

function FormAction({ isShowDelete = false, onDelete, onSubmit, loading }: FormActionProps) {
  const { colors } = useCustomTheme();

  const onConfirmDelete = () => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa?', [
      {
        text: 'Hủy bỏ',
        style: 'cancel',
      },
      { text: 'Tiếp tục', style: 'destructive', onPress: () => onDelete && onDelete() },
    ]);
  };

  return (
    <View style={styles.action}>
      {isShowDelete && (
        <TouchableHighlightComponent style={styles.buttonDel} onPress={onConfirmDelete}>
          <>
            {loading ? <Loading color={colors.error} /> : <BagCross color={colors.error} />}
            <RNText color="red">Xóa</RNText>
          </>
        </TouchableHighlightComponent>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onSubmit}
      >
        {loading && <Loading color={'white'} />}
        <RNText fontSize={18} color="white" style={{ marginLeft: 6 }}>
          Lưu
        </RNText>
      </TouchableOpacity>
    </View>
  );
}

export default FormAction;
