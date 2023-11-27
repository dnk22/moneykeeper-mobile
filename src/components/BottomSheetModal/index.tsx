import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCustomTheme } from 'resources/theme';
import { SafeAreaView } from 'react-native';

type BottomSheetProps = {
  ref: any;
  children: React.ReactElement;
  snapPoints?: string[];
  index?: number;
};

const BottomSheet = forwardRef(
  ({ children, snapPoints, index = 0 }: BottomSheetProps, ref: any) => {
    const { colors } = useCustomTheme();

    const snapPointsInit = useMemo(() => ['50%', '80%'], []);

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
        keyboardBehavior="fillParent"
      >
        <BottomSheetView style={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
export default BottomSheet;
