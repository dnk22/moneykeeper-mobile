// src/navigation/components/SharedScreens.tsx
import React from 'react';
import { sharedScreenRegistry } from './ShareStacksRegistry';
import { ROUTE_KEYS } from 'navigation/constants/routes';

interface SharedScreensProps {
  stack: any;
  screens?: Pick<ROUTE_KEYS, keyof ROUTE_KEYS>[];
}

export default function SharedScreens({ stack: Stack, screens }: SharedScreensProps) {
  const screenNames = !screens ? sharedScreenRegistry.getRegisteredScreenNames() : screens;

  return (
    <Stack.Group>
      {screenNames.map((name: any) => {
        const config = sharedScreenRegistry.getScreenConfig(name);
        if (!config) return null;

        return (
          <Stack.Screen
            key={name.toString()}
            name={name}
            component={config.component}
            options={({ route, navigation }: any) => {
              const resolvedOptions =
                typeof config.options === 'function'
                  ? config.options({ route, navigation })
                  : config.options;

              return {
                ...resolvedOptions,
                headerBackButtonDisplayMode: 'minimal',
              };
            }}
          />
        );
      })}
    </Stack.Group>
  );
}
