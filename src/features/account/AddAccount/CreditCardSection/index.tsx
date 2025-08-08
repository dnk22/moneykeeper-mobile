import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import StatementModalPicker from './StatementModalPicker';
import SvgIcon from 'components/SvgIcon';
import RNText from 'components/Text';
import SwitchField from 'components/Switch/SwitchField';
import Collapsible from 'react-native-collapsible';
import { useFormContext, useWatch } from 'react-hook-form';
import Notifications from './Notifications';
import styles from '../styles';

type ModalType = 'paymentDate' | 'statementDay';

function CreditCardSection({ colors }: { colors: any }) {
  const isModalType = useRef<ModalType>('statementDay');
  const [isShowModalStatement, setIsShowModalStatement] = useState(false);
  const { control, setValue } = useFormContext();
  const [isCollapse, setCollapse] = useState(true);

  const statementDay = useWatch({ control, name: 'creditCardStatementDay' });
  const paymentDay = useWatch({ control, name: 'creditCardDayAfterStatement' });
  const ccReminderList = useWatch({
    control,
    name: 'creditCardReminderList',
  });
  const isCCReminder = useWatch({
    control,
    name: 'isCCReminder',
  });

  const toggleModal = () => {
    setIsShowModalStatement((prev) => !prev);
  };

  const handleModalOpen = (type: ModalType) => {
    isModalType.current = type;
    toggleModal();
  };

  const handleStatementChange = (value: number) => {
    const fieldName =
      isModalType.current === 'statementDay'
        ? 'creditCardStatementDay'
        : 'creditCardDayAfterStatement';
    setValue(fieldName, value);
    toggleModal();
  };

  const onNotificationListChange = (value: string) => {
    setValue('creditCardReminderList', value);
  };

  useEffect(() => {
    setCollapse(!Boolean(isCCReminder));
  }, [isCCReminder]);

  return (
    <>
      <StatementModalPicker
        type={isModalType.current}
        isVisible={isShowModalStatement}
        statementDate={statementDay}
        paymentDate={paymentDay}
        onValueChange={handleStatementChange}
        onToggleModal={toggleModal}
      />
      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <View style={[styles.itemGroup, styles.itemGroupBetween]}>
          <View style={[styles.itemGroup, { gap: 10 }]}>
            <SvgIcon name="calendarHoliday" style={styles.icon} />
            <RNText preset="title">Ngày sao kê</RNText>
          </View>
          <Pressable
            style={[styles.statementDay, { backgroundColor: colors.background }]}
            onPress={() => handleModalOpen('statementDay')}
          >
            <RNText>{statementDay}</RNText>
          </Pressable>
        </View>
        <View style={[styles.itemGroup, styles.itemGroupBetween]}>
          <View style={[styles.itemGroup, { gap: 10 }]}>
            <SvgIcon name="calendarHoliday" style={styles.icon} />
            <RNText preset="title">Hạn thanh toán sau sao kê</RNText>
          </View>
          <Pressable
            style={[styles.statementDay, { backgroundColor: colors.background }]}
            onPress={() => handleModalOpen('paymentDate')}
          >
            <RNText>{paymentDay}</RNText>
          </Pressable>
        </View>
      </View>

      <View style={[styles.group, { backgroundColor: colors.surface }]}>
        <View style={[styles.itemGroup, styles.itemGroupBetween]}>
          <RNText preset="title">Thông báo thanh toán ?</RNText>
          <SwitchField name="isCCReminder" />
        </View>
        <Collapsible collapsed={isCollapse}>
          <Notifications value={ccReminderList} onValueChange={onNotificationListChange} />
        </Collapsible>
      </View>
    </>
  );
}
export default CreditCardSection;
