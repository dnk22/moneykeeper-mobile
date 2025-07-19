import { FirebaseDataSource } from 'services/firebase/appInit';
import AppInitService from 'services/initialization';

export const getDefaultAppData = async () => {
  const dataSource = new FirebaseDataSource();
  const appInit = AppInitService.getInstance(dataSource);
  await appInit.initializeApp();
  return true;
};
