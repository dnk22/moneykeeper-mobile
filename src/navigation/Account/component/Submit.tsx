import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SvgIcon, PressableHaptic } from 'components/index';

function Submit({}: HeaderButtonProps) {
  return (
    <PressableHaptic>
      <SvgIcon name="check" color="white" />
    </PressableHaptic>
  );
}
export default Submit;
