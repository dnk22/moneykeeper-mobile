import React, { forwardRef, useCallback, useMemo } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCustomTheme } from 'resources/theme';

type BottomSheetProps = {
  ref: any;
  children: React.ReactElement;
  snapPoints?: string[];
};

const BottomSheet = forwardRef(({ children, snapPoints }: BottomSheetProps, ref: any) => {
  const { colors } = useCustomTheme();
  const snapPointsInit = useMemo(() => ['50%', '70%', '90%'], []);

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />;
  }, []);

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints || snapPointsInit}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ backgroundColor: colors.background, flex: 1, paddingTop: 10 }}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});
export default BottomSheet;
