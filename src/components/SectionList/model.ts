import React from 'react';
import { SectionListProps } from 'react-native';

interface Props extends SectionListProps<any> {
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasPull?: boolean;
}

export type PropsSectionList = React.FC<Props>;
