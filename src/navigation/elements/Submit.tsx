import { SvgIcon, PressableHaptic } from 'components/index';

function Submit({ onPress }: { onPress: () => void }) {
  return (
    <PressableHaptic onPress={onPress}>
      <SvgIcon name="check" color="white" />
    </PressableHaptic>
  );
}
export default Submit;
