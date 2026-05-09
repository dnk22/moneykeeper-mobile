import React, { useMemo } from 'react';
import { StyleProp, TouchableOpacity, View, Modal, ModalProps, Pressable } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from '../SvgIcon';
import RNText from '../Text';
import { styles } from './styles';

type NewModalProps = Partial<ModalProps>;

export interface IModalComponentProps extends NewModalProps {
  isVisible: boolean;
  style?: StyleProp<any>;
  children: React.ReactNode;
  onBackdropPress?: () => void;
  onToggleModal: () => void;
  isShowClose?: boolean;
  height?: string | number;
  styleDefaultContent?: StyleProp<any>;
  title?: string;
  disabledBackDropClose?: boolean;
  alignment?: 'flex-start' | 'center' | 'flex-end';
}

const ModalComponent = ({
  isVisible,
  style,
  children,
  isShowClose,
  height,
  styleDefaultContent,
  onBackdropPress,
  disabledBackDropClose = false,
  onToggleModal,
  alignment = 'flex-end',
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
    <Modal
      visible={!!isVisible}
      allowSwipeDismissal
      transparent
      onRequestClose={onToggleModal}
      {...rest}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onHandleBackdropPress}
        accessibilityRole="button"
        accessible={true}
      />
      <View style={[styles.modal, style, { justifyContent: alignment }]}>
        <View
          style={[
            styles.modalView,
            { backgroundColor: colors.surface, height },
            styleDefaultContent,
          ]}
        >
          {isShowHeader && (
            <View
              style={[styles.header, styles.headerBorder, { borderBottomColor: colors.divider }]}
            >
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
      </View>
    </Modal>
  );
};

export default ModalComponent;
