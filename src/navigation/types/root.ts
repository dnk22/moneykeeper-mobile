import { NavigatorScreenParams } from '@react-navigation/native';
import { APPEARANCE, MAIN, MODAL_STACK } from 'utils/constants/navigation.constant';
import { MainTabStackParamsList } from './mainTab';
import { ModalStackParamList } from './modalStack';

export type RootStackParamList = {
  [MAIN]: NavigatorScreenParams<MainTabStackParamsList>;
  [MODAL_STACK]: NavigatorScreenParams<ModalStackParamList>;
  [APPEARANCE]: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
