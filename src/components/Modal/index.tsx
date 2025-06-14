import React, { memo, useMemo } from 'react';
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
  disableCloseOnPressBackDrop?: boolean;
}

const ModalComponent = ({
  isVisible,
  style,
  children,
  backdropColor,
  animationInTiming = 300,
  animationOutTiming = 300,
  animationIn = 'slideInUp',
  animationOut = 'slideOutDown',
  isShowClose,
  height,
  styleDefaultContent,
  onBackdropPress,
  disableCloseOnPressBackDrop = false,
  onToggleModal,
  title,
  ...rest
}: IModalComponentProps) => {
  const { colors } = useCustomTheme();

  const onHandleBackdropPress = () => {
    if (onBackdropPress) onBackdropPress();
    if (!disableCloseOnPressBackDrop) onToggleModal();
  };

  const headerComponent = useMemo(() => {
    if (!title && !isShowClose) return null;

    return (
      <View style={[styles.header, styles.headerBorder, { borderBottomColor: colors.divider }]}>
        {title && <RNText preset="modalTitle">{title}</RNText>}
        {isShowClose && (
          <TouchableOpacity style={styles.modalAction} onPress={onToggleModal}>
            <SvgIcon name="closeCircle" preset="closeModal" />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [title, isShowClose, onToggleModal]);
  

  return (
    <Modal
      isVisible={isVisible}
      backdropColor={backdropColor}
      style={[styles.modal, style]}
      useNativeDriver
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={300}
      useNativeDriverForBackdrop
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      animationIn={animationIn}
      animationOut={animationOut}
      onBackdropPress={onHandleBackdropPress}
      {...rest}
    >
      <View
        style={[styles.modalView, { backgroundColor: colors.surface, height }, styleDefaultContent]}
      >
        {headerComponent}
        {children}
      </View>
    </Modal>
  );
};

export default memo(ModalComponent, isEqual);
