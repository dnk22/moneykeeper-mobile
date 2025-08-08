import PressableHaptic from 'components/PressableHaptic';
import { SearchStatus } from 'iconsax-react-native';

function Search() {
  return (
    <PressableHaptic>
      <SearchStatus size="28" color="white" />
    </PressableHaptic>
  );
}
export default Search;
