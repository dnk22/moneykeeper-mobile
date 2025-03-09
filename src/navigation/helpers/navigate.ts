import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList, ModalStackParamList } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function navigateToModal<T extends keyof ModalStackParamList>(
  screen: T,
  params: ModalStackParamList[T],
) {
  navigate(ROUTES.MODAL_STACK, {
    screen,
    params,
  });
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: name as never, params: params as never }],
    });
  }
}
