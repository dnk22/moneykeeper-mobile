// src/navigation/components/SharedScreens.tsx
import React from 'react';
import { sharedScreenRegistry } from './ShareStacksRegistry';
import { RouteKeys } from 'navigation/constants/routes';

interface SharedScreensProps {
  stack: any;
  screens: Partial<RouteKeys[]> | 'all';
}

export default function SharedScreens({ stack: Stack, screens = 'all' }: SharedScreensProps) {
  const screenNames = screens === 'all' ? sharedScreenRegistry.getRegisteredScreenNames() : screens;

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
            options={config.options}
          />
        );
      })}
    </Stack.Group>
  );
}
