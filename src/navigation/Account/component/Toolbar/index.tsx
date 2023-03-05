import {
  SvgIcon,
  PressableHaptic,
  ModalComponent,
  RNText,
  Switch,
  CheckboxComponent,
  TouchableHighlightComponent,
} from 'components/index';
import { useState } from 'react';
import { View } from 'react-native';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { updateAccountViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';
import styles from './styles';

function Toolbar() {
  const { group, sort } = useAppSelector((state) => selectAccountViewSettings(state));
  const useDispatch = useAppDispatch();

  const [isShowModal, setIsShowModal] = useState(false);

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onGroupChange = (value: boolean) => {
    useDispatch(updateAccountViewSettings({ group: value }));
  };

  const onSort = (value: 'name' | 'custom') => {
    if (!group) {
      useDispatch(updateAccountViewSettings({ sort: value }));
      onToggleModal();
    }
  };

  return (
    <>
      <ModalComponent isVisible={isShowModal} onToggleModal={onToggleModal}>
        <View style={styles.container}>
          <View>
            <RNText style={styles.groupHeader} preset="linkXSmall">
              Nhóm
            </RNText>
            <View style={styles.groupContent}>
              <RNText preset="textMedium">Nhóm theo loại tài khoản</RNText>
              <Switch value={group} onValueChange={onGroupChange} />
            </View>
          </View>
          <View style={styles.group}>
            <RNText style={styles.groupHeader} preset="linkXSmall">
              Sắp xếp
            </RNText>
            <TouchableHighlightComponent onPress={() => onSort('name')} isActive={!group}>
              <View style={styles.groupContent}>
                <RNText preset="textMedium">Tên tài khoản</RNText>
                {sort === 'name' && <CheckboxComponent type="radio" check />}
              </View>
            </TouchableHighlightComponent>
            <TouchableHighlightComponent onPress={() => onSort('custom')} isActive={!group}>
              <View style={styles.groupContent}>
                <RNText preset="textMedium">Tự chọn</RNText>
                {sort === 'custom' && <CheckboxComponent type="radio" check />}
              </View>
            </TouchableHighlightComponent>
          </View>
        </View>
      </ModalComponent>
      <PressableHaptic onPress={onToggleModal}>
        <SvgIcon name="panel" color="white" />
      </PressableHaptic>
    </>
  );
}
export default Toolbar;
