'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/app/lib/store';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface StoreProviderProps {
  readonly children: React.ReactNode;
  readonly session: Session;
}

export default function StoreProvider({
  children,
  session
}: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        {children}
      </SessionProvider>
    </Provider>
  );
}