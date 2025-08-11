import { memo } from 'react';
import { Pressable, View } from 'react-native';
import RNText from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import PressableHaptic from 'components/PressableHaptic';
import InputField from 'components/InputField';
import ImageComponent from 'components/ImageComponent';
import isEqual from 'react-fast-compare';
import { useCustomTheme } from 'resources/theme';
import { useFormContext } from 'react-hook-form';
import styles from './styles';

type SelectedProps = {
  fieldName?: string;
  displayValue?: string;
  placeholder?: string;
  subTitle?: string;
  iconName?: string;
  defaultIcon?: string;
  onSelect?: () => void;
  onDelete?: () => void;
  required?: boolean;
  iconSize?: number;
};

function Selected({
  fieldName,
  displayValue,
  placeholder = '',
  subTitle = '',
  iconName,
  iconSize = 30,
  defaultIcon,
  onSelect,
  onDelete,
  required,
}: SelectedProps) {
  const { getFieldState, formState } = useFormContext<any>();
  const { colors } = useCustomTheme();
  const isShowOptional = !required && displayValue;
  const isError = required && fieldName && getFieldState(fieldName, formState)?.invalid;

  return (
    <>
      {fieldName && <InputField name={fieldName} rules={{ required }} style={styles.inputField} />}
      <PressableHaptic style={styles.itemGroup} onPress={onSelect}>
        <ImageComponent name={iconName} size={iconSize} defaultIcon={defaultIcon} />
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
