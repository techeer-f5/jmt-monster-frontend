import React, { ReactChild, ReactChildren } from 'react';
import { Container } from '@mui/material';
import Navbar from './navbar';
import Footer from './footer';

export interface LayoutProps {
    children: ReactChild | ReactChildren;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <Container className="bg-slate-200">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </Container>
    );
};

export default Layout;
