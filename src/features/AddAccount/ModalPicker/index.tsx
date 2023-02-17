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
import { Keyboard, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { TAccountType } from 'src/types/models';
import { useAppSelector } from 'store/index';
import {
  selectAllAccountType,
  selectAllProvider,
  selectAllBank,
} from 'store/account/account.selector';
import { BANK, EWALLET } from '../constants';

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
  const getAllAccountTypeList = useAppSelector((state) => selectAllAccountType(state));
  const getAllProviderList = useAppSelector((state) => selectAllProvider(state));
  const getAllBankList = useAppSelector((state) => selectAllBank(state));

  const [isSelected, setIsSelected] = useState(isTypeSelected);
  const [data, setData] = useState<TAccountType[]>(getAllAccountTypeList);

  useEffect(() => {
    setIsSelected(isTypeSelected);
  }, [isTypeSelected]);

  useEffect(() => {
    switch (isShowData) {
      case BANK:
        setData(getAllBankList);
        break;
      case EWALLET:
        setData(getAllProviderList);
        break;
      default:
        setData(getAllAccountTypeList);
        break;
    }
  }, [isShowData]);

  const title =
    isShowData === BANK
      ? 'Chọn ngân hàng'
      : isShowData === EWALLET
      ? 'Chọn nhà cung cấp'
      : 'Chọn loại tài khoản';

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
            {isShowData === BANK ? (
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

  const onModalHide = () => {
    if (isShowData === BANK) {
      setData(getAllBankList);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Modal
        styleDefaultContent={[isShowData === BANK ? styles.bankModal : {}]}
        isVisible={isVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onToggleModal={onToggleModal}
        onModalHide={onModalHide}
        title={title}
      >
        {isShowData === BANK && (
          <InputSearch placeholder="Nhập tên ngân hàng" onChangeText={onInputChange} />
        )}
        <FlatListComponent data={data} renderItem={renderItem} />
      </Modal>
    </TouchableWithoutFeedback>
  );
}
export default memo(ModalPicker, isEqual);
