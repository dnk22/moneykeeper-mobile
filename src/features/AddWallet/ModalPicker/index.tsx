import { memo, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import isEqual from 'react-fast-compare';
import { FlatListComponent, RNText, SvgIcon } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import { TouchableHighlight, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TAccountType } from 'src/types/models';
import { useAppSelector } from 'store/index';
import {
  accountTypeSelectors,
  bankSelectors,
  providerSelectors,
} from 'store/account/account.selector';

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
  const getAllAccountTypeList = useAppSelector((state) => accountTypeSelectors.selectAll(state));
  const getAllProviderList = useAppSelector((state) => providerSelectors.selectAll(state));
  const getAllBankList = useAppSelector((state) => bankSelectors.selectAll(state));

  const [isSelected, setIsSelected] = useState(isTypeSelected);
  const [data, setData] = useState<TAccountType[]>(getAllAccountTypeList);

  useEffect(() => {
    setIsSelected(isTypeSelected);
  }, [isTypeSelected]);

  useEffect(() => {
    switch (isShowData) {
      case 'bank':
        setData(getAllBankList);
        break;
      case 'eWallet':
        setData(getAllProviderList);
        break;
      default:
        setData(getAllAccountTypeList);
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

  const title =
    isShowData === 'bank'
      ? 'Chọn ngân hàng'
      : isShowData === 'eWallet'
      ? 'Chọn nhà cung cấp'
      : 'Chọn loại tài khoản';

  return (
    <Modal
      styleDefaultContent={{ maxHeight: '60%' }}
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onToggleModal={onToggleModal}
      title={title}
    >
      <FlatListComponent data={data} renderItem={renderItem} />
    </Modal>
  );
}
export default memo(ModalPicker, isEqual);
