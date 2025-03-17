import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from 'navigation/constants/routes';
import { MainTabStackParamsList } from './mainTab';
import { ModalStackParamList } from './modalStack';

export type RootStackParamList = {
  [ROUTES.AUTH]: undefined;
  [ROUTES.MAIN]: NavigatorScreenParams<MainTabStackParamsList>;
  [ROUTES.MODAL_STACK]: NavigatorScreenParams<ModalStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
