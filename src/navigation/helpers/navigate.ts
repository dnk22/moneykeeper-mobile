import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList, ModalStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';

class NavigationService {
  private static instance: NavigationService;
  navigationRef = createNavigationContainerRef<RootStackParamList>();

  private constructor() {}

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  navigate(name: Extract<keyof RootStackParamList, string>, params?: any) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.navigate(name, params);
    }
  }

  navigateToModal<T extends keyof ModalStackParamList>(screen: T, params: ModalStackParamList[T]) {
    this.navigate(ROUTES.MODAL_STACK, {
      screen,
      params,
    });
  }

  goBack() {
    if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
      this.navigationRef.goBack();
    }
  }

  reset(name: keyof RootStackParamList, params?: any) {
    if (this.navigationRef.isReady()) {
      this.navigationRef.reset({
        index: 0,
        routes: [{ name: name as never, params: params as never }],
      });
    }
  }
}

export default NavigationService.getInstance();
