import React, { memo } from 'react';
import { Pressable, View } from 'react-native';
import ModalComponent from 'components/Modal';
import RNText from 'components/Text';
import { Picker } from '@react-native-picker/picker';
import { useCustomTheme } from 'resources/theme';
import { DAY_IN_MONTH } from 'utils/constants';
import styles from './styles';

type ModalType = 'paymentDate' | 'statementDay';

interface StatementModalPickerProps {
  isVisible: boolean;
  statementDate: number;
  paymentDate: number;
  onValueChange: (value: number) => void;
  onToggleModal: () => void;
  type: ModalType;
}

const PAYMENT_DATES = [15, 25] as const;

const StatementModalPicker = ({
  isVisible,
  statementDate,
  paymentDate,
  onValueChange,
  onToggleModal,
  type,
}: StatementModalPickerProps) => {
  const { colors } = useCustomTheme();

  const currentValue = type === 'paymentDate' ? paymentDate : statementDate;
  const data = type === 'paymentDate' ? PAYMENT_DATES : DAY_IN_MONTH;
  const title = type === 'paymentDate' ? 'Hạn thanh toán sau sao kê' : 'Ngày sao kê';

  const handleValueChange = (value: number) => {
    onValueChange(value);
    onToggleModal();
  };

  const renderPickerItems = () =>
    data.map((item) => (
      <Picker.Item
        key={item.toString()}
        label={item.toString()}
        value={item}
        color={item === currentValue ? colors.primary : colors.text}
      />
    ));

  const HeaderComponent = memo(() => (
    <View style={[styles.header, { borderBottomColor: colors.divider }]}>
      <RNText preset="modalTitle">{title}</RNText>
      <Pressable onPress={onToggleModal}>
        <RNText color={colors.primary} style={styles.doneText}>
          Xong
        </RNText>
      </Pressable>
    </View>
  ));

  return (
    <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal} disabledBackDropClose>
      <HeaderComponent />
      <Picker selectedValue={currentValue} onValueChange={handleValueChange}>
        {renderPickerItems()}
      </Picker>
    </ModalComponent>
  );
};

export default memo(StatementModalPicker);
