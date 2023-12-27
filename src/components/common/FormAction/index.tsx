import { Alert, TouchableOpacity, View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from 'components/SvgIcon';
import Loading from 'components/Loading';
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
    Alert.alert('Xác nhận xóa', 'Bạn có chắc muốn xóa?', [
      {
        text: 'Hủy bỏ',
        style: 'cancel',
      },
      { text: 'Đồng ý', style: 'destructive', onPress: () => onDelete && onDelete() },
    ]);
  };

  return (
    <View style={styles.action}>
      {isShowDelete && (
        <TouchableHighlightComponent style={styles.buttonDel} onPress={onConfirmDelete}>
          <>
            {loading ? <Loading color={'red'} /> : <SvgIcon name="trash" color="red" />}
            <RNText color="red">Xóa</RNText>
          </>
        </TouchableHighlightComponent>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onSubmit}
      >
        {loading ? <Loading color={'white'} /> : <SvgIcon name="doneCircle" color="white" />}
        <RNText color="white" style={{ marginLeft: 5 }}>
          Lưu
        </RNText>
      </TouchableOpacity>
    </View>
  );
}

export default FormAction;
