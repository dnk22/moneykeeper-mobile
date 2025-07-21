import React, { memo, useMemo } from 'react';
import { StyleProp, TouchableOpacity, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from '../SvgIcon';
import RNText from '../Text';
import ReactNativeModal, { ModalProps } from 'react-native-modal';
import { styles } from './styles';

type NewModalProps = Partial<ModalProps>;

export interface IModalComponentProps extends NewModalProps {
  onToggleModal: () => void;
  isShowClose?: boolean;
  height?: string | number;
  styleDefaultContent?: StyleProp<any>;
  title?: string;
  disabledBackDropClose?: boolean;
}

const ModalComponent = ({
  isVisible,
  style,
  children,
  animationInTiming = 400,
  animationOutTiming = 400,
  animationIn = 'fadeInUp',
  animationOut = 'fadeOutDown',
  isShowClose,
  height,
  styleDefaultContent,
  onBackdropPress,
  disabledBackDropClose = false,
  onToggleModal,
  title,
  ...rest
}: IModalComponentProps) => {
  const { colors } = useCustomTheme();
  const isShowHeader = useMemo(() => !!title || isShowClose, [title, isShowClose]);

  const onHandleBackdropPress = () => {
    if (onBackdropPress) onBackdropPress();
    if (!disabledBackDropClose) onToggleModal();
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      style={[styles.modal, style]}
      useNativeDriver
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={1}
      useNativeDriverForBackdrop
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      animationIn={animationIn}
      animationOut={animationOut}
      onBackdropPress={onHandleBackdropPress}
      backdropOpacity={0.4}
      {...rest}
    >
      <View
        style={[styles.modalView, { backgroundColor: colors.surface, height }, styleDefaultContent]}
      >
        {isShowHeader && (
          <View style={[styles.header, styles.headerBorder, { borderBottomColor: colors.divider }]}>
            <RNText preset="modalTitle">{title}</RNText>
            {isShowClose && (
              <TouchableOpacity style={styles.modalAction} onPress={onToggleModal}>
                <SvgIcon name="closeCircle" preset="closeModal" />
              </TouchableOpacity>
            )}
          </View>
        )}
        {children}
      </View>
    </ReactNativeModal>
  );
};

export default ModalComponent;
