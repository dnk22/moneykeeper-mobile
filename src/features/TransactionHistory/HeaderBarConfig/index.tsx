import { useRef, useState } from 'react';
import { View } from 'react-native';
import { BottomSheet, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import DisplayModal from './DisplayModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import styles from './styles';

function HeaderBarConfig({ onPressSelectMode }: { onPressSelectMode: () => void }) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowDisplayModal, setShowDisplayModal] = useState(false);

  const onToggleModal = () => {
    bottomSheetModalRef.current?.present();
    setIsShowModal(!isShowModal);
  };
  const onToggleDisplayModal = () => {
    setShowDisplayModal(!isShowDisplayModal);
  };

  const setSelectMode = () => {
    onPressSelectMode();
    onToggleModal();
  };

  return (
    <>
      <TouchableHighlightComponent onPress={onToggleModal} underlayColor="transparent">
        <SvgIcon name="panel" color="white" />
      </TouchableHighlightComponent>
      <BottomSheet snapPoints={['28%']} ref={bottomSheetModalRef}>
        <View style={{ paddingHorizontal: 10 }}>
          <TouchableHighlightComponent onPress={setSelectMode}>
            <View style={styles.item}>
              <SvgIcon name="check" size={20} />
              <RNText fontSize={16}>Chọn bản ghi</RNText>
            </View>
          </TouchableHighlightComponent>
          <TouchableHighlightComponent onPress={setSelectMode}>
            <View style={styles.item}>
              <SvgIcon name="filter" size={20} />
              <View>
                <RNText fontSize={16}>Bộ lọc tùy chọn</RNText>
                <RNText fontSize={10} color="gray">
                  (Vuốt từ cạnh phải màn hình để truy cập nhanh)
                </RNText>
              </View>
            </View>
          </TouchableHighlightComponent>
          <TouchableHighlightComponent onPress={onToggleDisplayModal}>
            <View style={styles.item}>
              <SvgIcon name="display" size={20} />
              <RNText fontSize={16}>Cài đặt hiển thị</RNText>
            </View>
          </TouchableHighlightComponent>
        </View>
      </BottomSheet>
      <DisplayModal isVisible={isShowDisplayModal} onToggleModal={onToggleDisplayModal} />
    </>
  );
}

export default HeaderBarConfig;
