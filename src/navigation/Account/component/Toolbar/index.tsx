import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
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
import { accountViewSettingsSelector } from 'store/app/app.selector';
import { updateAccountViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';
import styles from './styles';

function Toolbar({}: HeaderButtonProps) {
  const { group, sort } = useAppSelector((state) => accountViewSettingsSelector(state));

  const [isShowModal, setIsShowModal] = useState(false);
  const useDispatch = useAppDispatch();

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onGroupChange = (value: boolean) => {
    useDispatch(updateAccountViewSettings({ group: value }));
  };

  const onSort = (value: 'name' | 'custom') => {
    useDispatch(updateAccountViewSettings({ sort: value }));
    onToggleModal();
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
            <TouchableHighlightComponent onPress={() => onSort('name')}>
              <View style={styles.groupContent}>
                <RNText preset="textMedium">Tên tài khoản</RNText>
                {sort === 'name' && <CheckboxComponent type="radio" check />}
              </View>
            </TouchableHighlightComponent>
            <TouchableHighlightComponent onPress={() => onSort('custom')}>
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
