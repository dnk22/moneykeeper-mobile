import { memo, useEffect, useState } from 'react';
import Modal from 'components/Modal';
import isEqual from 'react-fast-compare';
import { FlatListComponent, RNText, SvgIcon, TouchableHighlightComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import {
  Keyboard,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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

  const renderItem = ({ item }: { item: TAccountType }) => {
    const currentSelected = (itemId: string) => isSelected === itemId;
    const onPress = () => {
      setIsSelected(item._id);
      if (onPressItem) {
        onPressItem(item);
      }
    };

    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} preset="transactionType" />
            {isShowData === 'bank' ? (
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
          {currentSelected(item._id) && (
            <View style={[styles.itemActive, { backgroundColor: colors.background }]}>
              {currentSelected(item._id) && (
                <View style={[styles.itemActiveBackground, { backgroundColor: colors.primary }]} />
              )}
            </View>
          )}
        </View>
      </TouchableHighlightComponent>
    );
  };

  const onInputChange = (text: string) => {
    const bankFilteredList = getAllBankList.filter(
      (item) =>
        item.value.toLowerCase().includes(text.toLowerCase()) ||
        item?.shortName?.toLowerCase().includes(text.toLowerCase()) ||
        item?.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setData(bankFilteredList);
  };

  const title =
    isShowData === 'bank'
      ? 'Chọn ngân hàng'
      : isShowData === 'eWallet'
      ? 'Chọn nhà cung cấp'
      : 'Chọn loại tài khoản';

  const modalBankStyle = isShowData === 'bank' ? styles.bankModal : {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Modal
        styleDefaultContent={[modalBankStyle]}
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onToggleModal={onToggleModal}
        title={title}
      >
        {isShowData === 'bank' && (
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Nhập tên ngân hàng"
              style={[styles.inputSearch, { backgroundColor: colors.background }]}
              onChangeText={onInputChange}
            />
            <SvgIcon name="search" style={styles.iconSearch} size={18} color="gray" />
          </View>
        )}
        <FlatListComponent data={data} renderItem={renderItem} />
      </Modal>
    </TouchableWithoutFeedback>
  );
}
export default memo(ModalPicker, isEqual);
