import { memo, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import isEqual from 'react-fast-compare';
import {
  FlatListComponent,
  InputSearch,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

type ModalPickerProps = IModalComponentProps & {
  dataSource: any;
  title?: string;
  isItemSelected?: string;
  isShowSearch?: boolean;
  onPressItem?: (item: any) => void;
};

function ModalPicker({
  dataSource,
  title = 'Vui lòng chọn',
  isVisible,
  onToggleModal,
  isItemSelected,
  isShowSearch = false,
  onPressItem,
}: ModalPickerProps) {
  const { colors } = useCustomTheme();
  const [isSelected, setIsSelected] = useState(isItemSelected);
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    setIsSelected(isItemSelected);
  }, [isItemSelected]);

  const renderItem = ({ item }: { item: any }) => {
    const currentSelected = (itemId: string) => isSelected === itemId;
    const onPress = () => {
      setIsSelected(item.id);
      if (onPressItem) {
        onPressItem(item);
      }
    };

    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} preset="transactionType" />
            {item.shortName ? (
              <View>
                <RNText style={[styles.title, { color: colors.text }]}>{item.shortName}</RNText>
                <RNText fontSize={12} style={[styles.subTitle, { color: colors.text }]}>
                  {item.name}
                </RNText>
              </View>
            ) : (
              <RNText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </RNText>
            )}
          </View>
          {currentSelected(item.id) && (
            <View style={[styles.itemActive, { backgroundColor: colors.background }]}>
              {currentSelected(item.id) && (
                <View style={[styles.itemActiveBackground, { backgroundColor: colors.primary }]} />
              )}
            </View>
          )}
        </View>
      </TouchableHighlightComponent>
    );
  };

  const onInputChange = (text: string) => {
    const filteredData = dataSource.filter(
      (item: any) =>
        item.value.toLowerCase().includes(text.toLowerCase()) ||
        item?.shortName?.toLowerCase().includes(text.toLowerCase()) ||
        item?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setData(filteredData);
  };

  const onModalHide = () => {
    setData(dataSource);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Modal
        styleDefaultContent={styles.bankModal}
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onToggleModal={onToggleModal}
        onModalHide={onModalHide}
        title={title}
      >
        {isShowSearch && (
          <InputSearch placeholder="Nhập tên ngân hàng" onChangeText={onInputChange} />
        )}
        <FlatListComponent data={data} renderItem={renderItem} />
      </Modal>
    </TouchableWithoutFeedback>
  );
}
export default memo(ModalPicker, isEqual);
