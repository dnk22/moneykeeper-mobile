import React from 'react';
import Card from 'components/Card';
import withObservables from '@nozbe/with-observables';
import { Observable } from '@nozbe/watermelondb/utils/rx';
import { getAccountCountObserve } from 'database/querying';

type AccountCardProps = {
  accountCount?: Observable<number>;
  isDeactivate?: boolean;
  children: React.ReactNode;
  title?: string;
};
function AccountCard({ accountCount, children, title }: AccountCardProps) {
  const titleWithCount = `${title} (${accountCount})`;
  console.log(!Boolean(accountCount), 'show');

  return (
    <Card title={titleWithCount} collapse={!Boolean(accountCount)}>
      {children}
    </Card>
  );
}

export default withObservables(
  ['accountCount'],
  ({ isDeactivate = false }: AccountCardProps) => ({
    accountCount: getAccountCountObserve(!isDeactivate),
  }),
)<any>(AccountCard);
