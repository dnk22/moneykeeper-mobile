import { TRANSACTIONS } from 'navigation/constants';
import HomeBottomBarFlat from './HomeBottomBarFlat';
import HomeBottomBarSticky from './HomeBottomBarSticky';

const bottomBarType = 'flat';

function HomeBottomBar({ ...props }) {
  return bottomBarType === 'flat' ? (
    <HomeBottomBarFlat {...props} />
  ) : (
    <HomeBottomBarSticky {...props} circle={TRANSACTIONS} />
  );
}
export default HomeBottomBar;
