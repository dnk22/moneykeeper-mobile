import React, { memo } from 'react';
import {
  ContextMenuView,
  ContextMenuViewProps,
  ContextMenuViewState,
  MenuElementConfig,
} from 'react-native-ios-context-menu';
import styles from './styles';
import isEqual from 'react-fast-compare';

type ContextTypes = ContextMenuViewProps & ContextMenuViewState;
export type IMenuItemsProps = MenuElementConfig[] | undefined;

interface IContextMenuProps extends ContextTypes {
  children: React.ReactNode;
  menuTitle?: string;
  menuItems?: IMenuItemsProps;
}

function ContextMenu({
  children,
  menuTitle = '',
  menuItems,
  ...rest
}: IContextMenuProps) {
  return (
    <ContextMenuView
      style={styles.container}
      menuConfig={{
        menuTitle: menuTitle,
        menuItems: menuItems,
      }}
      {...rest}
    >
      {children}
    </ContextMenuView>
  );
}

export default memo(ContextMenu, isEqual);
