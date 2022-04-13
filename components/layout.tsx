import React, { ReactNode } from 'react';
import Header from './header';
import Navbar from './navbar';
import MetaConfigs from './meta-configs';
import LoginModal from './login-modal';
import GlobalSnackbar from './global-snackbar';
import { kakaoMapDivId } from './kakao-map';

export type ChildElement = ReactNode;

export interface LayoutProps {
    children: ChildElement;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <MetaConfigs />
            <div className="bg-fuchsia-500 min-w-screen min-h-screen flex flex-grow flex-col">
                <Header />
                <main
                    id={kakaoMapDivId}
                    className="flex-1 flex flex-grow bg-white min-h-[85vh] justify-center align-middle center-children"
                >
                    {children}
                </main>
                <Navbar />
            </div>
            <LoginModal />
            <GlobalSnackbar />
        </div>
    );
};

export default Layout;
