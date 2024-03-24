import { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { CheckboxComponent, RNText } from 'components/index';
import styles from './styles';

type NotificationsProps = {
  value?: string;
  onValueChange: (value: string) => void;
};

const notiList = [
  {
    label: 'Trước 3 ngày',
    value: '3',
  },
  {
    label: 'Trước 1 tuần',
    value: '7',
  },
];

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
      {notiList.map((item) => (
        <Pressable style={styles.itemNotification} key={item.value}>
          <RNText>{item.label}</RNText>
          <CheckboxComponent
            type="checkbox"
            check={value?.includes(item.value)}
            onPress={(value) => handleChangeChecked(value, item.value)}
          />
        </Pressable>
      ))}
    </>
  );
}
export default Notifications;
