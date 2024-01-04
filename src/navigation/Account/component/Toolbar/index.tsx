import { useState } from 'react';
import { View } from 'react-native';
import {
  SvgIcon,
  PressableHaptic,
  ModalComponent,
  RNText,
  Switch,
  CheckboxComponent,
  TouchableHighlightComponent,
} from 'components/index';
import { selectAccountViewSettings } from 'store/app/app.selector';
import { updateAccountViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';
import { SORT_ACCOUNT_BY_KEY } from 'utils/constant';
import styles from './styles';

function Toolbar() {
  const { group, sort, isViewActive } = useAppSelector((state) => selectAccountViewSettings(state));
  const useDispatch = useAppDispatch();

  const [isShowModal, setIsShowModal] = useState(false);

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const onGroupChange = (value: boolean) => {
    useDispatch(updateAccountViewSettings({ group: value }));
  };

  const onSort = (value: keyof typeof SORT_ACCOUNT_BY_KEY) => {
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
              <Switch value={group} onValueChange={onGroupChange} disabled={!isViewActive} />
            </View>
          </View>
          <View style={styles.group}>
            <RNText style={styles.groupHeader} preset="linkXSmall">
              Sắp xếp theo
            </RNText>
            <TouchableHighlightComponent
              isDisable={!isViewActive}
              onPress={() => onSort(SORT_ACCOUNT_BY_KEY.accountName)}
            >
              <View style={styles.groupContent}>
                <RNText preset="textMedium">Tên tài khoản</RNText>
                {sort === SORT_ACCOUNT_BY_KEY.accountName && (
                  <CheckboxComponent type="radio" check />
                )}
              </View>
            </TouchableHighlightComponent>
            <TouchableHighlightComponent
              isDisable={!isViewActive}
              onPress={() => onSort(SORT_ACCOUNT_BY_KEY.sortOrder)}
            >
              <View style={styles.groupContent}>
                <RNText preset="textMedium">Tự chọn</RNText>
                {sort === SORT_ACCOUNT_BY_KEY.sortOrder && <CheckboxComponent type="radio" check />}
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
