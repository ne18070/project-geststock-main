'use client';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import StoreProvider from '@/app/StoreProvider';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import 'antd/dist/reset.css';


export const metadata = {
    title: 'Gestion Factures et Commandes',
    description: 'Application de gestion de factures et commandes',
};

export const ClientLayout = ({ children, session }: { children: React.ReactNode, readonly session: Session }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const localTheme = localStorage.getItem('theme');
        if (localTheme === 'dark') {
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
    };

    return (
         <AntdRegistry>
            <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        locale={undefined}>
            <AntApp>
                <StoreProvider session={session}>{children}</StoreProvider>
             </AntApp>
           </ConfigProvider>
         </AntdRegistry>
        );
    };