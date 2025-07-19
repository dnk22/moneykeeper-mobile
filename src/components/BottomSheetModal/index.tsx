import React, { forwardRef, useCallback } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCustomTheme } from 'resources/theme';

type BottomSheetProps = {
  children: React.ReactElement;
  snapPoints?: string[];
  index?: number;
};

const snapPointsInit = ['30%', '50%', '80%'];

const BottomSheet = forwardRef(
  ({ children, snapPoints, index = 2 }: BottomSheetProps, ref: any) => {
    const { colors } = useCustomTheme();

    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
      return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />;
    }, []);

    return (
      <BottomSheetModal
        ref={ref}
        index={index}
        snapPoints={snapPoints || snapPointsInit}
        backdropComponent={renderBackdrop}
        enableDynamicSizing
        keyboardBehavior="extend"
      >
        <BottomSheetView
          style={{ backgroundColor: colors.background, flex: 1, height: '100%', paddingTop: 10 }}
        >
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

export default BottomSheet;
