import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SvgIcon, PressableHaptic } from 'components/index';

function Toolbar({}: HeaderButtonProps) {
  return (
    <PressableHaptic>
      <SvgIcon name="panel" color="white" />
    </PressableHaptic>
  );
}
export default Toolbar;
