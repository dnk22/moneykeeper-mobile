import TouchableHighlightComponent from 'components/TouchableHighlight';
import { View } from 'react-native';
import styles from './styles';
import { RNText } from 'components/index';
import Submit from '../Submit';

type FormActionProps = {
  isShowDelete?: boolean;
  onSubmit?: () => void;
  onDelete?: () => void;
};

function FormAction({ isShowDelete = false, onDelete, onSubmit }: FormActionProps) {
  return (
    <View style={styles.action}>
      {isShowDelete && (
        <TouchableHighlightComponent style={styles.buttonDel} onPress={onDelete}>
          <RNText color="red">Xóa</RNText>
        </TouchableHighlightComponent>
      )}
      <Submit onPress={onSubmit} />
    </View>
  );
}

export default FormAction;