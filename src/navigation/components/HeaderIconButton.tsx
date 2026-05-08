import PressableHaptic from 'components/PressableHaptic';
import type { ReactNode } from 'react';

type HeaderIconButtonProps = {
  icon: ReactNode;
  onPress?: () => void;
};

function HeaderIconButton({ icon, onPress }: HeaderIconButtonProps) {
  return (
    <PressableHaptic onPress={onPress}>
      {icon}
    </PressableHaptic>
  );
}

export default HeaderIconButton;