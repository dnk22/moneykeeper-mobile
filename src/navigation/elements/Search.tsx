import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';

function Search({}: HeaderButtonProps) {
  return (
    <PressableHaptic>
      <SvgIcon name="search" color="white" />
    </PressableHaptic>
  );
}
export default Search;
