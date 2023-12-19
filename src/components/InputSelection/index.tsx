import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import { Control } from 'react-hook-form';
import SvgIcon from 'components/SvgIcon';
import PressableHaptic from 'components/PressableHaptic';
import Form from './FORM';
import styles from './styles';

type SelectedProps = {
  title?: string;
  subTitle?: string;
  isShowSubTitle?: boolean;
  icon?: any;
  onSelect?: () => void;
  value?: string;
  onDelete?: () => void;
  required?: boolean;
  name?: string;
  control?: Control<any, any>;
  error?: any;
  iconOpacity?: boolean;
};

function Selected({
  title,
  subTitle,
  isShowSubTitle = false,
  icon = 'questionCircle',
  onSelect,
  value,
  onDelete,
  required = false,
  name,
  control,
  error,
  iconOpacity = false,
}: SelectedProps) {
  const isError = error && !Boolean(value);
  return (
    <>
      {name && <Form name={name} control={control} rules={{ required: required }} />}
      <PressableHaptic style={[styles.itemGroup]} onPress={onSelect}>
        <SvgIcon name={icon} style={[iconOpacity ? { color: '#adb5bd' } : {}]} />
        <View style={styles.groupContent}>
          <View style={styles.title}>
            {value && isShowSubTitle && (
              <RNText fontSize={10} preset="subTitle">
                {subTitle}
              </RNText>
            )}
            {value && !required ? (
              <View style={styles.value}>
                <RNText numberOfLines={1} style={{ maxWidth: '90%' }}>
                  {value}
                </RNText>
                <Pressable onPress={onDelete}>
                  <SvgIcon name="closeCircle" size={20} color="gray" />
                </Pressable>
              </View>
            ) : (
              <RNText
                style={{
                  maxWidth: '90%',
                  fontWeight: isError ? 'bold' : '500',
                  opacity: value || isError ? 1 : 0.6,
                }}
                numberOfLines={1}
                color={isError ? 'red' : ''}
              >
                {value || title}
              </RNText>
            )}
          </View>
          <SvgIcon name="forward" preset="forwardLink" style={styles.iconForward} />
        </View>
      </PressableHaptic>
    </>
  );
}

export default memo(Selected, isEqual);
