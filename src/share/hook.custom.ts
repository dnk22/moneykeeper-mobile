import { SCREEN_HEIGHT } from 'share/dimensions';
import { useEffect, useRef } from 'react';
import { SCREEN_WIDTH } from './dimensions';

function useInterval(callback: any, delay: number | null) {
  const savedCallback: any = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function useSwipe(
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void
) {
  let firstTouch = 0;

  // set user touch start position
  function onTouchStart(e: any) {
    firstTouch = e.nativeEvent.pageX;
  }

  // when touch ends check for swipe directions
  function onTouchEnd(e: any) {
    // get touch position and screen size
    const positionX = e.nativeEvent.pageX;
    const positionY = e.nativeEvent.pageY;
    const rangeX = SCREEN_WIDTH / 6;
    const rangY = SCREEN_HEIGHT / 20;

    // check if position is growing positively and has reached specified rangeX
    if (positionX - firstTouch > rangeX) {
      onSwipeRight && onSwipeRight();
    }
    // check if position is growing negatively and has reached specified rangeX
    else if (firstTouch - positionX > rangeX) {
      onSwipeLeft && onSwipeLeft();
    }
    // check if position is growing positively and has reached specified rangY
    else if (firstTouch - positionY > rangY) {
      onSwipeUp && onSwipeUp();
    }
    // check if position is growing negatively and has reached specified rangY
    else if (positionY - firstTouch > rangY) {
      onSwipeDown && onSwipeDown();
    }
  }

  return { onTouchStart, onTouchEnd };
}

export { useInterval, useSwipe };
