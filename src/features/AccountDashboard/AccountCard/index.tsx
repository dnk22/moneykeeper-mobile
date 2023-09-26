import React from 'react';
import Card from 'components/Card';
import { useAppSelector } from 'store/index';
import { selectAccountListExpandState } from 'store/app/app.selector';

type AccountCardProps = {
  children: React.ReactNode;
  title?: string;
  expandKey: 'active' | 'inActive';
};
function AccountCard({ expandKey, children, title }: AccountCardProps) {
  const expand = useAppSelector((state) => selectAccountListExpandState(state));

  return (
    <Card title={title} collapse={!expand[expandKey]}>
      {children}
    </Card>
  );
}

export default AccountCard;
