import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { SvgIcon, PressableHaptic } from 'components/index';
import { selectReportViewSettings } from 'store/app/app.selector';
import { updateReportViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';

function ChangeView({}: HeaderButtonProps) {
  const useDispatch = useAppDispatch();
  const isGrid = useAppSelector((state) => selectReportViewSettings(state));
  const handleOnChangeReportView = () => {
    useDispatch(updateReportViewSettings());
  };
  return (
    <PressableHaptic onPress={handleOnChangeReportView}>
      <SvgIcon name={isGrid ? 'grid' : 'list'} color="white" />
    </PressableHaptic>
  );
}
export default ChangeView;
