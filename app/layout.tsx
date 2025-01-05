import type { Metadata } from 'next';
import { ClientLayout } from './client-layout';
import { getServerSession, Session } from 'next-auth'
import { authOptions } from './lib/auth'

export const metadata: Metadata = {
    title: 'Gestion Factures et Commandes',
    description: 'Application de gestion de factures et commandes',
};

export default async function RootLayout({
    children,
}: {
    readonly children: React.ReactNode
}) {
  const session = (await getServerSession(authOptions)) || {} as Session
  return (
    <html lang="fr">
    <body suppressHydrationWarning>
      <ClientLayout session={session}>
       {children}
      </ClientLayout>
    </body>
</html>
);
}