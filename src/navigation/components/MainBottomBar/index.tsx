import HomeBottomBarFlat from './HomeBottomBarFlat';
// import HomeBottomBarSticky from './HomeBottomBarSticky';
// import { useEffect, useState } from 'react';
// import { useAppSelector } from 'store/index';

function MainBottomBar({ ...props }: any) {
  // const homeBottomBar = useAppSelector((state) => selectAppearanceConfig(state));

  // const [BottomBarComponent, setBottomBarComponent] = useState(() =>
  //   homeBottomBar === HOME_BOTTOM_BAR.FLAT ? HomeBottomBarFlat : HomeBottomBarSticky,
  // );

  // useEffect(() => {
  //   setBottomBarComponent(
  //     homeBottomBar === HOME_BOTTOM_BAR.FLAT ? HomeBottomBarFlat : HomeBottomBarSticky,
  //   );
  // }, [homeBottomBar]);

  return <HomeBottomBarFlat {...props} />;
}

export default MainBottomBar;
