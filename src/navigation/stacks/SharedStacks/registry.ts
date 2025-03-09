import { ComponentType } from 'react';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

type ScreenConfig<ParamList extends ParamListBase, RouteName extends keyof ParamList> = {
  component: ComponentType<any>;
  options?:
    | NativeStackNavigationOptions
    | ((props: { route: RouteProp<ParamList, RouteName> }) => NativeStackNavigationOptions);
};

export class ScreenRegistry<ParamList extends ParamListBase> {
  private screens: Map<keyof ParamList, ScreenConfig<ParamList, any>> = new Map();

  register<RouteName extends keyof ParamList>(
    name: RouteName,
    config: ScreenConfig<ParamList, RouteName>,
  ): this {
    this.screens.set(name, config);
    return this;
  }

  getScreens(): Map<keyof ParamList, ScreenConfig<ParamList, any>> {
    return this.screens;
  }

  getScreenConfig<RouteName extends keyof ParamList>(
    name: RouteName,
  ): ScreenConfig<ParamList, RouteName> | undefined {
    return this.screens.get(name) as ScreenConfig<ParamList, RouteName> | undefined;
  }

  getRegisteredScreenNames(): (keyof ParamList)[] {
    return Array.from(this.screens.keys());
  }
}
