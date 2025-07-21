import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCustomTheme } from 'resources/theme';
import { styles } from './styles';

type BottomSheetProps = {
  children: React.ReactElement;
  backgroundColor?: string;
  paddingTop?: string;
  backdropColor?: string;
  disabledBackdrop?: boolean;
} & React.ComponentProps<typeof BottomSheetModal>;

const snapPointsInit = ['30%', '50%', '80%'];

const BottomSheetComponent = forwardRef(
  (
    {
      children,
      snapPoints,
      index = 2,
      disabledBackdrop,
      backgroundColor,
      backdropColor,
      ...rest
    }: BottomSheetProps,
    ref: any,
  ) => {
    const { colors } = useCustomTheme();

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
      if (disabledBackdrop) {
        return undefined;
      }
      return (
        <BottomSheetBackdrop
          {...props}
          style={backdropColor ? { backgroundColor: backdropColor } : undefined}
          opacity={0.3}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      );
    }, []);

    return (
      <BottomSheetModal
        ref={ref}
        index={index}
        snapPoints={snapPoints || snapPointsInit}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        {...rest}
      >
        <BottomSheetView
          style={[{ backgroundColor: backgroundColor || colors.background }, styles.modalContainer]}
        >
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default BottomSheetComponent;
