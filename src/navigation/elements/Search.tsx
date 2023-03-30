import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SvgIcon, PressableHaptic } from 'components/index';

function Search({}: HeaderButtonProps) {
  return (
    <PressableHaptic>
      <SvgIcon name="search" color="white" />
    </PressableHaptic>
  );
}
export default Search;
