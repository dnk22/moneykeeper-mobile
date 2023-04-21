import { useState } from 'react';
import { View } from 'react-native';
import {
  CheckboxComponent,
  ModalComponent,
  RNText,
  SvgIcon,
  TouchableHighlightComponent,
} from 'components/index';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { useAppDispatch, useAppSelector } from 'store/index';
import { selectTransactionListConfig } from 'store/app/app.selector';
import { updateTransactionListConfig } from 'store/app/app.slice';

function TransactionListByAccountConfig({ onPressSelectMode }: { onPressSelectMode: () => void }) {
  const { colors } = useCustomTheme();
  const [isShowModal, setIsShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const {
    isShowAmountAfterTransaction,
    isShowDescription,
    isShowExpense,
    isShowIncome,
  } = useAppSelector((state) => selectTransactionListConfig(state));

  const onToggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const updateTransactionViewConfig = (config: any) => {
    dispatch(updateTransactionListConfig(config));
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
      <ModalComponent isVisible={isShowModal} onToggleModal={onToggleModal}>
        <TouchableHighlightComponent onPress={setSelectMode}>
          <View style={styles.item}>
            <SvgIcon name="check" size={20} style={{ marginHorizontal: 5 }} />
            <RNText fontSize={16}>Chọn bản ghi</RNText>
          </View>
        </TouchableHighlightComponent>
        <View style={styles.divider} />
        <View style={styles.group}>
          <RNText
            style={[styles.displayTextStyle, { backgroundColor: colors.surface }]}
            fontSize={12}
            color="gray"
          >
            Cài đặt hiển thị
          </RNText>
          <TouchableHighlightComponent
            onPress={() => updateTransactionViewConfig({ isShowDescription: !isShowDescription })}
          >
            <View style={styles.item}>
              <CheckboxComponent type="checkbox" disabled check={isShowDescription} />
              <RNText fontSize={16}>Hiển thị diễn giải</RNText>
            </View>
          </TouchableHighlightComponent>
          <TouchableHighlightComponent
            onPress={() =>
              updateTransactionViewConfig({
                isShowAmountAfterTransaction: !isShowAmountAfterTransaction,
              })
            }
          >
            <View style={styles.item}>
              <CheckboxComponent type="checkbox" disabled check={isShowAmountAfterTransaction} />
              <RNText fontSize={16}>Số dư sau mỗi giao dịch</RNText>
            </View>
          </TouchableHighlightComponent>
          <TouchableHighlightComponent
            onPress={() => updateTransactionViewConfig({ isShowExpense: !isShowExpense })}
          >
            <View style={styles.item}>
              <CheckboxComponent type="checkbox" disabled check={isShowExpense} />
              <RNText fontSize={16}>Hiển thị chi </RNText>
            </View>
          </TouchableHighlightComponent>
          <TouchableHighlightComponent
            onPress={() => updateTransactionViewConfig({ isShowIncome: !isShowIncome })}
          >
            <View style={styles.item}>
              <CheckboxComponent type="checkbox" disabled check={isShowIncome} />
              <RNText fontSize={16}>Hiển thị thu</RNText>
            </View>
          </TouchableHighlightComponent>
        </View>
      </ModalComponent>
    </>
  );
}

export default TransactionListByAccountConfig;
