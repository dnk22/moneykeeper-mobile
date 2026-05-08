import React, { useState } from 'react';
import { View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import CheckboxComponent from 'components/Checkbox';
import PressableHaptic from 'components/PressableHaptic';
import ModalComponent from 'components/Modal';
import RNText from 'components/Text';
import Switch from 'components/Switch';

import { selectAccountViewSettings } from 'store/app/app.selector';
import { updateAccountViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';
import { appSettingsFb } from 'services/firebase/db/appSettings';
import { FB_PATH } from 'services/firebase/config';
import { syncQueueLocalQuery } from 'database/querying';
import { SyncQueueAction } from 'database/models/syncQueue.model';
import { Autobrightness, Link, Setting4, Sort } from 'iconsax-react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

function Toolbar() {
  const { colors } = useCustomTheme();
  const { groupByType, sortByName } = useAppSelector((state) => selectAccountViewSettings(state));
  const useDispatch = useAppDispatch();

  const [isShowModal, setIsShowModal] = useState(false);

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const updateSettings = async (value: { [key: string]: boolean }) => {
    useDispatch(updateAccountViewSettings(value));
    await appSettingsFb
      .updateSettings({
        path: FB_PATH.SETTINGS_CHILD.ACCOUNTS,
        newSettings: value,
      })
      .catch(async (error) => {
        await syncQueueLocalQuery.updateSyncQueueItem({
          tableName: `${FB_PATH.SETTINGS}/${FB_PATH.SETTINGS_CHILD.ACCOUNTS}`,
          payload: value,
          action: SyncQueueAction.UPDATE,
        });
      });
  };

  const onGroupChange = (value: boolean) => {
    updateSettings({ groupByType: value });
  };

  const onSortChange = async (value: boolean) => {
    await updateSettings({ sortByName: value });
    onToggleModal();
  };

  return (
    <>
      <ModalComponent isVisible={isShowModal} onToggleModal={onToggleModal}>
        <View style={styles.container}>
          <View>
            <RNText style={styles.groupHeader} preset="textXSmall">
              Nhóm
            </RNText>
            <View style={styles.groupContent}>
              <View style={styles.groupItem}>
                <Link size={22} color={colors.primaryVariant} />
                <RNText numberOfLines={undefined} preset="textMedium">
                  Nhóm theo loại tài khoản
                </RNText>
              </View>
              <Switch
                style={[{ marginTop: 10 }]}
                value={groupByType}
                onValueChange={onGroupChange}
              />
            </View>
          </View>
          <View style={styles.group}>
            <RNText style={styles.groupHeader} preset="textXSmall">
              Sắp xếp theo
            </RNText>
            <TouchableHighlightComponent disabled={groupByType} onPress={() => onSortChange(true)}>
              <View style={styles.groupContent}>
                <View style={styles.groupItem}>
                  <Autobrightness size={22} color={colors.primaryVariant} />
                  <RNText preset="textMedium">Tên tài khoản</RNText>
                </View>
                {sortByName && <CheckboxComponent type="radio" check />}
              </View>
            </TouchableHighlightComponent>
            <TouchableHighlightComponent disabled={groupByType} onPress={() => onSortChange(false)}>
              <View style={styles.groupContent}>
                <View style={styles.groupItem}>
                  <Sort size={22} color={colors.primaryVariant} />
                  <RNText preset="textMedium">Tự chọn</RNText>
                </View>
                {!sortByName && <CheckboxComponent checkbox check />}
              </View>
            </TouchableHighlightComponent>
          </View>
        </View>
      </ModalComponent>
      <PressableHaptic onPress={onToggleModal}>
        <Setting4 size="26" color={colors.text} />
      </PressableHaptic>
    </>
  );
}

export default Toolbar;
