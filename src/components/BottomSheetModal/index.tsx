import React, { forwardRef } from 'react';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import type { TrueSheetProps } from '@lodev09/react-native-true-sheet';
import { useCustomTheme } from 'resources/theme';
import { styles } from './styles';
import { StyleProp, View } from 'react-native';

type BottomSheetProps = {
  children: React.ReactElement;
  backgroundColor?: string;
  onDismiss?: () => void;
  modalContainerStyle?: StyleProp<any>;
} & Partial<TrueSheetProps>;

const BottomSheetComponent = forwardRef<TrueSheet, BottomSheetProps>(
  ({ children, backgroundColor, onDismiss, modalContainerStyle, ...rest }, ref) => {
    const { colors } = useCustomTheme();

    return (
      <TrueSheet
        ref={ref}
        cornerRadius={24}
        onDidDismiss={onDismiss}
        {...rest}
        backgroundColor={backgroundColor || colors.background}
      >
        <View style={[styles.modalContainer, modalContainerStyle]}>{children}</View>
      </TrueSheet>
    );
  },
);

export default BottomSheetComponent;

export type { BottomSheetProps, TrueSheet };
