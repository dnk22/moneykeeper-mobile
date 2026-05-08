import { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import { TAccount } from 'database/types';

type UseAccountDashboardHeaderParams = {
  accountData: TAccount[];
  pageIndex: number;
  setPageIndex: (index: number) => void;
  onChangePageIndex: (index: number) => void;
};

export default function useAccountDashboardHeader({
  accountData,
  pageIndex,
  setPageIndex,
  onChangePageIndex,
}: UseAccountDashboardHeaderParams) {
  const [overviewHeight, setOverviewHeight] = useState<number | null>(null);
  const listOffsetsRef = useRef<Record<number, number>>({});
  const overviewScrollValue = useRef(new Animated.Value(0)).current;

  const totalAsset = useMemo(
    () =>
      accountData.reduce((total, account) => {
        const accountAmount = Number(account.closingAmount ?? account.initialAmount ?? 0);
        return Number.isNaN(accountAmount) ? total : total + accountAmount;
      }, 0),
    [accountData],
  );

  const onOverviewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextHeight = event.nativeEvent.layout.height;
      if (!nextHeight || nextHeight === overviewHeight) return;
      setOverviewHeight(nextHeight);
    },
    [overviewHeight],
  );

  const syncOverviewOffset = useCallback(
    (index: number) => {
      overviewScrollValue.setValue(listOffsetsRef.current[index] ?? 0);
    },
    [overviewScrollValue],
  );

  const onListScrollOffsetChange = useCallback(
    (index: number, offsetY: number) => {
      const safeOffset = Math.max(0, offsetY);
      listOffsetsRef.current[index] = safeOffset;
      if (index !== pageIndex) return;
      overviewScrollValue.setValue(safeOffset);
    },
    [overviewScrollValue, pageIndex],
  );

  const onTabChange = useCallback(
    (index: number) => {
      setPageIndex(index);
      onChangePageIndex(index);
      syncOverviewOffset(index);
    },
    [onChangePageIndex, setPageIndex, syncOverviewOffset],
  );

  const onPageSelected = useCallback(
    (index: number) => {
      setPageIndex(index);
      syncOverviewOffset(index);
    },
    [setPageIndex, syncOverviewOffset],
  );

  const maxCollapseDistance = Math.max(overviewHeight ?? 1, 1);
  const isOverviewMeasured = overviewHeight !== null;

  const overviewAnimatedStyle = useMemo(
    () => ({
      height: overviewScrollValue.interpolate({
        inputRange: [0, maxCollapseDistance],
        outputRange: [overviewHeight ?? 0, 0],
        extrapolate: 'clamp',
      }),
      opacity: overviewScrollValue.interpolate({
        inputRange: [0, maxCollapseDistance * 0.8],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: overviewScrollValue.interpolate({
            inputRange: [0, maxCollapseDistance],
            outputRange: [0, -maxCollapseDistance * 0.3],
            extrapolate: 'clamp',
          }),
        },
      ],
      marginBottom: overviewScrollValue.interpolate({
        inputRange: [0, maxCollapseDistance],
        outputRange: [12, 0],
        extrapolate: 'clamp',
      }),
    }),
    [maxCollapseDistance, overviewHeight, overviewScrollValue],
  );

  return {
    totalAsset,
    onOverviewLayout,
    onListScrollOffsetChange,
    onTabChange,
    onPageSelected,
    isOverviewMeasured,
    overviewAnimatedStyle,
  };
}
