import React, { ReactChild, ReactChildren } from 'react';
import Footer from './footer';
import Header from './header';
import Navbar from './navbar';
import RightSidebar from './right-sidebar';

export type ChildElement = ReactChild | ReactChildren;

export interface LayoutProps {
    children: ChildElement;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="bg-slate-200 min-w-screen min-h-screen flex flex-grow flex-col">
            <Header className="text-white bg-sky-300 h-[7.5vh] center-children">
                <p>Hi Header!</p>
            </Header>
            <div className="flex flex-grow flex-row">
                <Navbar className="text-white bg-sky-500 w-[15vw] center-children">
                    <p>Hi Navbar!</p>
                </Navbar>
                <main className="flex flex-[1] bg-sky-600 justify-center align-middle center-children">
                    <div>{children}</div>
                </main>
                <RightSidebar className="text-white bg-sky-500 w-[15vw] center-children">
                    <p>Hi Right Sidebar!</p>
                </RightSidebar>
            </div>
            <Footer className="text-white bg-sky-400 h-[7.5vh] center-children">
                <p>Hi Footer!</p>
            </Footer>
        </div>
    );
};

export default Layout;
