import React, { useMemo } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  Modal,
  ModalProps,
  Animated,
  Easing,
  Platform,
  Pressable,
} from 'react-native';
import { useCustomTheme } from 'resources/theme';
import SvgIcon from '../SvgIcon';
import RNText from '../Text';
import { styles } from './styles';

type NewModalProps = Partial<ModalProps>;

export interface IModalComponentProps extends NewModalProps {
  isVisible: boolean;
  style?: StyleProp<any>;
  children: React.ReactNode;
  animationInTiming?: number;
  animationOutTiming?: number;
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
  animationInTiming = 400,
  animationOutTiming = 400,
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

  // Animation state
  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: animationInTiming,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationOutTiming,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }).start();
    }
  }, [isVisible, animationInTiming, animationOutTiming, opacity]);

  const onHandleBackdropPress = () => {
    if (onBackdropPress) onBackdropPress();
    if (!disabledBackDropClose) onToggleModal();
  };

  return (
    <Modal
      visible={!!isVisible}
      transparent
      animationType="fade"
      onRequestClose={onToggleModal}
      {...rest}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onHandleBackdropPress}
        accessibilityRole="button"
        accessible={true}
      >
        <Animated.View style={[styles.modal, style, { opacity, justifyContent: alignment }]}>
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
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ModalComponent;
