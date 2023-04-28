import React from 'react';
import { FlatListProps } from 'react-native';

interface Props extends FlatListProps<any> {
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasPull?: boolean;
  id?: string;
}

export type PropsFlatList = React.FC<Props>;
