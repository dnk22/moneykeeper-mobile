import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { RNText, ModalComponent } from 'components/index';
import { Picker } from '@react-native-picker/picker';
import { useCustomTheme } from 'resources/theme';
import { DAY_IN_MONTH } from 'utils/constant';
import styles from './styles';

type StatementModalPickerProps = {
  isVisible: boolean;
  statementDate: number;
  paymentDate: number;
  onValueChange: (value: number) => void;
  onToggleModal: any;
  type: 'paymentDate' | 'statementDay';
};

export default function StatementModalPicker({
  isVisible,
  statementDate,
  paymentDate,
  onValueChange,
  onToggleModal,
  type,
}: StatementModalPickerProps) {
  const { colors } = useCustomTheme();
  const [day, setDay] = useState<number>(statementDate);
  const data = type === 'paymentDate' ? [15, 25] : DAY_IN_MONTH;

  useEffect(() => {
    setDay(type === 'paymentDate' ? paymentDate : statementDate);
  }, [type]);

  const handleOnDone = () => {
    onValueChange(day);
  };

  return (
    <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal} isBackdropClose={false}>
      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <RNText preset="linkMedium">
          {type === 'paymentDate' ? 'Hạn thanh toán sau sao kê' : 'Ngày sao kê'}
        </RNText>
        <Pressable onPress={handleOnDone}>
          <RNText color={colors.primary} style={{ fontWeight: '700' }}>
            Xong
          </RNText>
        </Pressable>
      </View>
      <Picker selectedValue={day} onValueChange={(itemValue) => setDay(itemValue)}>
        {data.map((item) => (
          <Picker.Item
            color={item === day ? colors.primary : colors.text}
            key={item.toString()}
            label={item.toString()}
            value={item}
          />
        ))}
      </Picker>
    </ModalComponent>
  );
}
