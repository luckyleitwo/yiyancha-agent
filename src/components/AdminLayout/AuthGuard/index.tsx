import { history, useModel } from '@umijs/max';
import { useEffect, type ReactNode } from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { initialState, loading } = useModel('@@initialState');
  const status = initialState?.authStatus;

  useEffect(() => {
    if (!loading && status === 'anonymous') history.replace('/login');
  }, [loading, status]);

  if (loading || status !== 'authenticated') return null;
  return <>{children}</>;
}
