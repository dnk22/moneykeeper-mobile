import { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { CheckboxComponent, RNText } from 'components/index';
import styles from './styles';

type NotificationsProps = {
  value?: string;
  onValueChange: (value: string) => void;
};

function Notifications({ value, onValueChange }: NotificationsProps) {
  const [noti, setNoti] = useState<string[]>([]);

  useEffect(() => {
    if (value) {
      setNoti(value.split());
    }
  }, []);

  useEffect(() => {
    onValueChange(noti.toString() || '');
  }, [noti]);

  const handleChangeChecked = (isActive: boolean, value: string) => {
    if (isActive) {
      setNoti([...noti, value]);
    } else {
      const newState = noti.filter((item) => item !== value);
      setNoti(newState);
    }
  };

  return (
    <>
      <Pressable style={styles.itemNotification}>
        <RNText>Ngày thanh toán</RNText>
        <CheckboxComponent
          type="checkbox"
          check={value?.includes('0')}
          onPress={(value) => handleChangeChecked(value, '0')}
        />
      </Pressable>
      <Pressable style={styles.itemNotification}>
        <RNText>Trước 1 ngày</RNText>
        <CheckboxComponent
          type="checkbox"
          check={value?.includes('1')}
          onPress={(value) => handleChangeChecked(value, '1')}
        />
      </Pressable>
      <Pressable style={styles.itemNotification}>
        <RNText>Trước 2 ngày</RNText>
        <CheckboxComponent
          type="checkbox"
          check={value?.includes('2')}
          onPress={(value) => handleChangeChecked(value, '2')}
        />
      </Pressable>
      <Pressable style={styles.itemNotification}>
        <RNText>Trước 1 tuần</RNText>
        <CheckboxComponent
          type="checkbox"
          check={value?.includes('7')}
          onPress={(value) => handleChangeChecked(value, '7')}
        />
      </Pressable>
    </>
  );
}
export default Notifications;
