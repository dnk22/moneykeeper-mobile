import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView } from 'react-native';

type UseAccountTypeTabsParams = {
  pageIndex: number;
};

export default function useAccountTypeTabs({ pageIndex }: UseAccountTypeTabsParams) {
  const scrollRef = useRef<ScrollView>(null);
  const tabLayoutsRef = useRef<Record<number, { x: number; width: number }>>({});
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const scrollActiveTabToCenter = useCallback(
    (index: number) => {
      const currentTabLayout = tabLayoutsRef.current[index];
      if (!currentTabLayout || viewportWidth <= 0) return;

      const centerOffset = currentTabLayout.x + currentTabLayout.width / 2 - viewportWidth / 2;
      const maxOffset = Math.max(0, contentWidth - viewportWidth);
      const offset = Math.max(0, Math.min(centerOffset, maxOffset));

      scrollRef.current?.scrollTo({ x: offset, animated: true });
    },
    [contentWidth, viewportWidth],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollActiveTabToCenter(pageIndex);
    }, 0);

    return () => clearTimeout(timer);
  }, [pageIndex, scrollActiveTabToCenter]);

  const onTabLayout = useCallback(
    (index: number) => (event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      tabLayoutsRef.current[index] = { x, width };

      if (index === pageIndex) {
        scrollActiveTabToCenter(index);
      }
    },
    [pageIndex, scrollActiveTabToCenter],
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setViewportWidth(event.nativeEvent.layout.width);
  }, []);

  const onContentSizeChange = useCallback((width: number) => {
    setContentWidth(width);
  }, []);

  return {
    scrollRef,
    onTabLayout,
    onLayout,
    onContentSizeChange,
  };
}
