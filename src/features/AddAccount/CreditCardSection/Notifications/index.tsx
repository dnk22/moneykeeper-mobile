import { useCallback, useMemo } from 'react';
import { Pressable } from 'react-native';
import CheckboxComponent from 'components/Checkbox';
import RNText from 'components/Text';
import styles from './styles';

interface NotificationOption {
  label: string;
  value: string;
}

interface NotificationsProps {
  value?: string;
  onValueChange: (value: string) => void;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { label: 'Ngày thanh toán', value: '0' },
  { label: 'Trước 3 ngày', value: '3' },
  { label: 'Trước 1 tuần', value: '7' },
] as const;

const NotificationItem = ({
  label,
  value,
  isChecked,
  onToggle,
}: {
  label: string;
  value: string;
  isChecked: boolean;
  onToggle: (value: string, isChecked: boolean) => void;
}) => (
  <Pressable style={styles.itemNotification} onPress={() => onToggle(value, !isChecked)}>
    <RNText>{label}</RNText>
    <CheckboxComponent
      type="checkbox"
      check={isChecked}
      onPress={(checked) => onToggle(value, checked)}
    />
  </Pressable>
);

function Notifications({ value = '', onValueChange }: NotificationsProps) {
  const selectedValues = useMemo(() => {
    return value ? new Set(value.split(',')) : new Set<string>();
  }, [value]);

  const handleToggle = useCallback(
    (itemValue: string, isChecked: boolean) => {
      const newValues = new Set(selectedValues);

      if (isChecked) {
        newValues.add(itemValue);
      } else {
        newValues.delete(itemValue);
      }

      onValueChange(Array.from(newValues).join(','));
    },
    [selectedValues, onValueChange],
  );

  return (
    <>
      {NOTIFICATION_OPTIONS.map((item) => (
        <NotificationItem
          key={item.value}
          label={item.label}
          value={item.value}
          isChecked={selectedValues.has(item.value)}
          onToggle={handleToggle}
        />
      ))}
    </>
  );
}

export default Notifications;
