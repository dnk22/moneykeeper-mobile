import React, { memo } from 'react';
import { StyleProp, TouchableOpacity, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { useCustomTheme } from 'resources/theme';
import isEqual from 'react-fast-compare';
import SvgIcon from '../SvgIcon';
import RNText from '../Text';
import { styles } from './styles';

type NewModalProps = Partial<ModalProps>;

export interface IModalComponentProps extends NewModalProps {
  onToggleModal: () => void;
  isShowClose?: boolean;
  height?: string | number;
  styleDefaultContent?: StyleProp<any>;
  title?: string;
  isBackdropClose?: boolean;
}

const ModalComponent = ({
  isVisible,
  style,
  children,
  backdropColor = '#6e768142',
  animationInTiming = 400,
  animationOutTiming = 400,
  animationIn = 'slideInUp',
  animationOut = 'slideOutDown',
  isShowClose,
  height,
  styleDefaultContent,
  onBackdropPress,
  isBackdropClose = true,
  onToggleModal,
  title,
  ...rest
}: IModalComponentProps) => {
  const { colors } = useCustomTheme();
  const onHandleBackdropPress = () => {
    onBackdropPress && onBackdropPress();
    isBackdropClose && onToggleModal && onToggleModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropColor={backdropColor}
      style={[styles.modal, style]}
      onBackdropPress={onHandleBackdropPress}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      hideModalContentWhileAnimating={true}
      animationIn={animationIn}
      animationOut={animationOut}
      {...rest}
      useNativeDriver
    >
      <View
        style={[styles.modalView, { backgroundColor: colors.surface, height }, styleDefaultContent]}
      >
        {title && isShowClose && (
          <View style={styles.header}>
            {title && <RNText preset="modalTitle">{title}</RNText>}
            {isShowClose && (
              <TouchableOpacity style={styles.modalAction} onPress={onToggleModal}>
                <SvgIcon name="closeCircle" preset="closeModal" />
              </TouchableOpacity>
            )}
          </View>
        )}
        {children}
      </View>
    </Modal>
  );
};

export default memo(ModalComponent, isEqual);
