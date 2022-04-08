import React, { ReactChild, ReactChildren } from 'react';
import { Container } from '@mui/material';
import Footer from './footer';
import Header from './header';
import Navbar from './navbar';
import RightSidebar from './right-sidebar';

export interface LayoutProps {
    children: ReactChild | ReactChildren;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Container className="bg-slate-200 min-w-screen min-h-screen flex-initial flex-col">
            <Header />
            <div className="flex-1 flex-row">
                <Navbar />
                <main className="flex-[2] bg-cyan-600">{children}</main>
                <RightSidebar />
            </div>
            <Footer />
        </Container>
    );
};

export default Layout;
