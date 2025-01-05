'use client';

import { Layout, Menu, Button, Drawer, ConfigProvider } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
    ShoppingCartOutlined,
    FileTextOutlined,
    UserOutlined,
    SettingOutlined,
    BoxPlotOutlined,
    CarOutlined,
    HistoryOutlined,
    BellOutlined,
    LogoutOutlined,
    HomeOutlined,
    GlobalOutlined,
    ApartmentOutlined,
    ShoppingOutlined,
    TagsOutlined,
    BarChartOutlined,
    TeamOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import CompanySwitcher from '@/app/components/company/CompanySwitcher';
import { useCompany } from '@/app/hooks/useCompany';

const { Header, Sider, Content } = Layout;

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const { currentCompany } = useCompany();
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleLogout = async () => {
        await signOut({callbackUrl : '/login'});
        router.push('/login');
    };


    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Accueil',
            onClick: () => router.push('/'),
            roles: ['admin', 'gestionnaire', 'agent'],
        },
        {
            key: '/commandes',
            icon: <ShoppingCartOutlined />,
            label: 'Commandes',
            roles: ['admin', 'gestionnaire', 'agent'],
            children: [
                {
                    key: '/commandes/liste',
                    icon: <ShoppingCartOutlined />,
                    label: 'Liste',
                    onClick: () => router.push('/commandes'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
                {
                    key: '/commandes/creer',
                    icon: <ShoppingCartOutlined />,
                    label: 'Créer',
                    onClick: () => router.push('/commandes/creer'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
            ],
        },
        {
            key: '/factures',
            icon: <FileTextOutlined />,
            label: 'Factures',
            children: [
                {
                    key: '/factures/liste',
                    icon: <FileTextOutlined />,
                    label: 'Liste',
                    onClick: () => router.push('/factures'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
                {
                    key: '/factures/creer',
                    icon: <FileTextOutlined />,
                    label: 'Créer',
                    onClick: () => router.push('/factures/creer'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
            ],
        },
        {
            key: 'livraisons',
            icon: <CarOutlined />,
            label: 'Livraisons',
            onClick: () => router.push('/livraisons'),
            roles: ['admin', 'gestionnaire', 'agent'],
        },
        {
            key: '/historique',
            icon: <HistoryOutlined />,
            label: 'Historique',
            onClick: () => router.push('/historique'),
            roles: ['admin', 'gestionnaire', 'agent'],
        },
        {
            key: 'stocks',
            icon: <BoxPlotOutlined />,
            label: 'Stocks',
            onClick: () => router.push('/stocks'),
            roles: ['admin', 'gestionnaire', 'agent'],
        },
        {
            key: 'notifications',
            icon: <BellOutlined />,
            label: 'Notifications',
            onClick: () => router.push('/notifications'),
            roles: ['admin', 'gestionnaire', 'agent'],
        },
        {
            key: '/parametrages',
            icon: <SettingOutlined />,
            label: 'Paramétrages',
            children: [
                {
                    key: '/parametrages/parametres-generaux',
                    icon: <GlobalOutlined />,
                    label: 'Paramètres généraux',
                    onClick: () => router.push('/parametrages/parametres-generaux'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
                {
                    key: '/parametrages/compagnies',
                    icon: <ApartmentOutlined />,
                    label: 'Compagnies',
                    onClick: () => router.push('/parametrages/compagnies'),
                    roles: ['admin', 'gestionnaire', 'agent'],
                },
                {
                    key: '/parametrages/produits',
                    icon: <ShoppingOutlined />,
                    label: 'Produits',
                    children: [
                        {
                            key: '/parametrages/produits/liste',
                            icon: <ShoppingOutlined />,
                            label: 'Liste',
                            onClick: () => router.push('/parametrages/produits'),
                            roles: ['admin', 'gestionnaire', 'agent'],
                        },
                    ],
                },
                {
                    key: '/parametrages/utilisateurs',
                    icon: <UserOutlined />,
                    label: 'Utilisateurs',
                    onClick: () => router.push('/parametrages/utilisateurs'),
                },
                {
                    key: '/parametrages/promotions',
                    icon: <TagsOutlined />,
                    label: 'Promotions',
                    onClick: () => router.push('/parametrages/promotions'),
                },
                {
                    key: '/parametrages/roles-permissions',
                    icon: <TeamOutlined />,
                    label: 'Rôles et permissions',
                    onClick: () => router.push('/parametrages/roles-permissions'),
                },
                {
                    key: '/parametrages/statistiques',
                    icon: <BarChartOutlined />,
                    label: 'Statistiques',
                    onClick: () => router.push('/parametrages/statistiques'),
                },
            ],
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Déconnexion',
            onClick: handleLogout,
        },
    ].filter(
        (item) =>
            !item.roles || item?.roles.includes(session?.user?.role as string),
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: currentCompany?.theme.primaryColor || '#1677ff',
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                {isMobile ? (
                    <Drawer
                        title={<span className="text-lg font-bold">Menu</span>}
                        placement="left"
                        onClose={() => setMobileOpen(false)}
                        open={mobileOpen}
                        closable={true}
                    >
                        <Menu
                            theme="light"
                            defaultSelectedKeys={[pathname]}
                            mode="vertical" // Ensure menu is vertical in the drawer
                            items={menuItems}
                            onClick={() => setMobileOpen(false)} // close drawer on click
                            className="pt-2 max-w-fit"
                        />
                    </Drawer>


                ) : (
                    <Sider
                        className="sider-rounded"
                        collapsible
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                    >
                        <h1 className="text-white text-xl font-bold flex justify-center p-2">
                            {collapsed ? (
                                <span className="text-2xl">OMB</span>
                            ) : (
                                'QuickSale ESTOMB'
                            )}
                        </h1>
                        <Menu
                            theme="dark"
                            defaultSelectedKeys={[pathname]}
                            mode="inline"
                            items={menuItems}
                            className="pt-2"
                        />
                    </Sider>
                )}

                <Layout>
                    <Header className="bg-white p-0 px-4 flex items-center justify-between">
                        <div className="flex items-center text-white ">
                            {isMobile && (
                                <Button
                                    type="text"
                                    icon={<MenuOutlined style={{ color: 'white' }} />}
                                    onClick={() => setMobileOpen(true)}
                                    className="mr-2"
                                />
                            )}
                            {/* <div className="text-lg font-semibold text-white ">
                                {menuItems.find((item) => pathname.startsWith(item.key))?.label ||
                                    'Dashboard'}
                            </div> */}
                        </div>
                        <CompanySwitcher />
                    </Header>
                    <Content className="m-2 md:m-4">
                        <div className="p-2 md:p-6 bg-white rounded-lg min-h-[360px]">
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}