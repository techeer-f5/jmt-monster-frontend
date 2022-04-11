import React, { ReactNode } from 'react';
import Header from './header';
import Navbar from './navbar';
import MetaConfigs from './meta-configs';
import usePwaInstall from '../hooks/use-pwa-install';

export type ChildElement = ReactNode;

export interface LayoutProps {
    children: ChildElement;
}

const Layout = ({ children }: LayoutProps) => {
    usePwaInstall();

    return (
        <div>
            <MetaConfigs />
            <div className="bg-slate-200 min-w-screen min-h-screen flex flex-grow flex-col">
                <Header className="text-white text-lg bg-sky-300 h-[7.5vh] center-children">
                    <p>Hi Header!</p>
                </Header>
                <main className="flex flex-[1] bg-sky-600 justify-center align-middle center-children">
                    <div>{children}</div>
                </main>
                <Navbar />
            </div>
        </div>
    );
};

export default Layout;
