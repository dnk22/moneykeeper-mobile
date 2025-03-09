import PressableHaptic from 'components/PressableHaptic';
import SvgIcon from 'components/SvgIcon';
import { selectReportViewSettings } from 'store/app/app.selector';
import { updateReportViewSettings } from 'store/app/app.slice';
import { useAppDispatch, useAppSelector } from 'store/index';

function ChangeView() {
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
