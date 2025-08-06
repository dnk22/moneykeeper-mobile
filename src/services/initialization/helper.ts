import { FirebaseDataSource } from 'services/firebase/appInit';
import AppInitService from 'services/initialization';
import { updateAppConfig } from 'store/app/app.slice';

const initializeAppData = async (dispatch: any) => {
  const dataSource = new FirebaseDataSource();
  const appInit = AppInitService.getInstance(dataSource);
  await appInit.initializeApp();
  return dataSource.getAppSettings().then((settings) => {
    if (dispatch) {
      dispatch(updateAppConfig(settings));
    }
  });
};
export default initializeAppData;
