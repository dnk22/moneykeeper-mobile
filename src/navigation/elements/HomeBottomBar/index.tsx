import { TRANSACTIONS } from 'utils/constants/navigation.constant';
import HomeBottomBarFlat from './HomeBottomBarFlat';
import HomeBottomBarSticky from './HomeBottomBarSticky';
import { useAppSelector } from 'store/index';
import { selectHomeBottomBarType } from 'store/app/app.selector';
import { useMemo } from 'react';
import { FLAT } from 'utils/constants';

function HomeBottomBar({ ...props }: any) {
  const homeBottomBar = useAppSelector((state) => selectHomeBottomBarType(state));
  const isFlatType = useMemo(() => homeBottomBar === FLAT, [homeBottomBar]);

  return isFlatType ? (
    <HomeBottomBarFlat {...props} />
  ) : (
    <HomeBottomBarSticky {...props} circle={TRANSACTIONS} />
  );
}
export default HomeBottomBar;
