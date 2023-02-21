import { memo } from 'react';
import { ModalComponent } from 'components/index';
import { IModalComponentProps } from 'components/Modal';
import isEqual from 'react-fast-compare';

function ParentList({ isVisible, onToggleModal }: IModalComponentProps) {
  return <ModalComponent isVisible={isVisible} onToggleModal={onToggleModal}>
    
  </ModalComponent>;
}
export default memo(ParentList, isEqual);
