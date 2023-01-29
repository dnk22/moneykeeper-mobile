import { memo, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import isEqual from 'react-fast-compare';
import { FlatListComponent, RNText, SvgIcon } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { Account_Type, Bank, Provider } from 'utils/constant';
import { TouchableHighlight, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TAccountType } from 'src/types/models';

type ModalPickerProps = IModalComponentProps & {
  isTypeSelected?: string;
  isShowData: string;
  onPressItem?: (item: TAccountType) => void;
};

function ModalPicker({
  isVisible,
  onToggleModal,
  isTypeSelected,
  isShowData,
  onPressItem,
}: ModalPickerProps) {
  const { colors } = useCustomTheme();
  const [isSelected, setIsSelected] = useState(isTypeSelected);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (!isTypeSelected) {
      setIsSelected(isTypeSelected);
    }
  }, [isTypeSelected]);

  useEffect(() => {
    switch (isShowData) {
      case 'bank':
        setData(Bank);
        break;
      case 'eWallet':
        setData(Provider);
        break;
      default:
        setData(Account_Type);
        break;
    }
  }, [isShowData]);

  const currentSelected = (itemId: string) => isSelected === itemId;

  const renderItem = ({ item }: { item: TAccountType }) => {
    const onPress = () => {
      setIsSelected(item._id);
      if (onPressItem) {
        onPressItem(item);
      }
    };

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor={colors.background}
        style={{ borderRadius: 10 }}
      >
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} preset="transactionType" />
            <RNText style={[styles.title, { color: colors.text }]}>{item.name}</RNText>
          </View>
          {currentSelected(item._id) && (
            <View style={[styles.itemActive, { backgroundColor: colors.background }]}>
              {currentSelected(item._id) && (
                <View style={[styles.itemActiveBackground, { backgroundColor: colors.primary }]} />
              )}
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <Modal
      styleDefaultContent={{ maxHeight: '60%' }}
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onToggleModal={onToggleModal}
      title="Chọn loại tài khoản"
    >
      <FlatListComponent data={data} renderItem={renderItem} />
    </Modal>
  );
}
export default memo(ModalPicker, isEqual);
