import { memo } from 'react';
import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import PressableHaptic from 'components/PressableHaptic';
import InputField from 'components/InputField';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import FastImage from 'react-native-fast-image';
import styles from './styles';
import { useFormContext } from 'react-hook-form';

type SelectedProps = {
  fieldName?: string;
  displayValue?: string;
  placeholder?: string;
  subTitle?: string;
  icon?: string;
  defaultIcon?: string;
  onSelect?: () => void;
  onDelete?: () => void;
  required?: boolean;
};

const unknownIcon = require('assets/images/default/unknown.png');

function Selected({
  fieldName,
  displayValue,
  placeholder = '',
  subTitle = '',
  icon,
  defaultIcon,
  onSelect,
  onDelete,
  required,
}: SelectedProps) {
  const { control, getFieldState, formState } = useFormContext<any>();
  const { colors } = useCustomTheme();
  const iconUri = typeof icon === 'string' ? { uri: icon } : icon;
  const defaultIconUrl = typeof defaultIcon === 'string' ? { uri: defaultIcon } : defaultIcon;
  const isShowOptional = !required && displayValue;
  const isError = required && fieldName && getFieldState(fieldName, formState)?.invalid;

  return (
    <>
      {fieldName && (
        <InputField
          name={fieldName}
          control={control}
          rules={{ required }}
          style={styles.inputField}
        />
      )}
      <PressableHaptic style={styles.itemGroup} onPress={onSelect}>
        <FastImage
          defaultSource={unknownIcon}
          source={iconUri || defaultIconUrl}
          style={styles.itemIcon}
        />
        <View style={styles.groupContent}>
          <View style={styles.title}>
            {displayValue && subTitle && (
              <RNText fontSize={10} preset="subTitle">
                {subTitle}
              </RNText>
            )}
            <View
              style={[
                styles.value,
                isShowOptional && { backgroundColor: colors.background, marginLeft: 5 },
              ]}
            >
              <RNText
                numberOfLines={1}
                color={isError ? colors.error : colors.text}
                style={[styles.content, { fontWeight: displayValue ? '500' : undefined }]}
              >
                {displayValue || placeholder}
              </RNText>
              {isShowOptional && (
                <Pressable onPress={onDelete}>
                  <SvgIcon name="closeCircle" size={20} color="gray" />
                </Pressable>
              )}
            </View>
          </View>
          <SvgIcon name="forward" preset="forwardLink" style={styles.iconForward} />
        </View>
      </PressableHaptic>
    </>
  );
}

export default memo(Selected, isEqual);
