import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import styles from './styles';
import { IconProps } from 'components/SvgIcon/const';
import PressableHaptic from 'components/PressableHaptic';
import { Control, RegisterOptions } from 'react-hook-form';
import Form from './FORM';

type SelectedProps = {
  title?: string;
  icon?: IconProps;
  onSelect?: () => void;
  value?: string;
  onDelete?: () => void;
  required?: boolean;
  name?: string;
  control?: Control<any, any>;
  error?: any;
};

function Selected({
  title,
  icon = 'questionCircle',
  onSelect,
  value,
  onDelete,
  required = false,
  name,
  control,
  error,
}: SelectedProps) {
  const isError = error && !Boolean(value);
  return (
    <>
      {name && <Form name={name} control={control} rules={{ required: true }} />}
      <PressableHaptic style={[styles.itemGroup]} onPress={onSelect}>
        <SvgIcon name={icon} style={{ transform: [{ scale: 1.1 }] }} />
        <View style={styles.groupContent}>
          {value && !required ? (
            <View style={styles.value}>
              <RNText fontSize={16} numberOfLines={1} style={{ maxWidth: '90%' }}>
                {value}
              </RNText>
              <Pressable onPress={onDelete}>
                <SvgIcon name="closeCircle" size={20} color="gray" />
              </Pressable>
            </View>
          ) : (
            <RNText
              fontSize={16}
              style={{ maxWidth: '90%', fontWeight: isError ? 'bold' : 'normal' }}
              numberOfLines={1}
              color={isError ? 'red' : ''}
            >
              {value || title}
            </RNText>
          )}
          <SvgIcon name="forward" preset="forwardLink" style={styles.iconForward} />
        </View>
      </PressableHaptic>
    </>
  );
}

export default memo(Selected, isEqual);
