import React, { ReactNode } from 'react';
import Header from './header';
import Navbar from './navbar';
import MetaConfigs from './meta-configs';

export type ChildElement = ReactNode;

export interface LayoutProps {
    children: ChildElement;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <MetaConfigs />
            <div className="bg-slate-200 min-w-screen min-h-screen flex flex-grow flex-col">
                <Header />
                <main className="flex flex-[1] bg-white justify-center align-middle center-children">
                    <div>{children}</div>
                </main>
                <Navbar />
            </div>
        </div>
    );
};

export default Layout;
