import { SvgIcon, PressableHaptic } from 'components/index';

function HeaderIcon({
  onPress,
  name = 'check',
  color = 'white',
}: {
  onPress: () => void;
  name?: string;
  color?: string;
}) {
  return (
    <PressableHaptic onPress={onPress}>
      <SvgIcon name={name} color={color} />
    </PressableHaptic>
  );
}
export default HeaderIcon;
