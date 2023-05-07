import React, { memo } from 'react';
import { StyleProp, TouchableOpacity, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { styles } from './styles';
import isEqual from 'react-fast-compare';
import SvgIcon from 'components/SvgIcon';
import RNText from 'components/Text';
import { useCustomTheme } from 'resources/theme';

const defaultProps = {
  isVisible: false,
  isShowClose: true,
  backdropColor: '#6e768142',
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
};

type NewModalProps = Partial<ModalProps>;

export interface IModalComponentProps extends NewModalProps {
  onToggleModal: () => void;
  isShowClose?: boolean;
  height?: string | number;
  styleDefaultContent?: StyleProp<any>;
  title?: string;
}

const ModalComponent = ({
  isVisible,
  style,
  children,
  backdropColor,
  animationInTiming = 400,
  animationOutTiming = 400,
  animationIn,
  animationOut,
  isShowClose,
  height,
  styleDefaultContent,
  onBackdropPress,
  onToggleModal,
  title,
  ...rest
}: IModalComponentProps) => {
  const { colors } = useCustomTheme();
  const onHandleBackdropPress = () => {
    onBackdropPress && onBackdropPress();
    onToggleModal();
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

ModalComponent.defaultProps = defaultProps;

export default memo(ModalComponent, isEqual);
