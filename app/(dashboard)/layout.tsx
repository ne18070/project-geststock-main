'use client';

import MainLayout from '@/app/components/layouts/MainLayout';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { data: session } = useSession();
  if (!session) {
    redirect('/login');
  }
  return <MainLayout>{children}</MainLayout>;
}
