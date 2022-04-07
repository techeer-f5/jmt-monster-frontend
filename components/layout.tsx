import React, { ReactChild, ReactChildren } from "react";
import Navbar from "./navbar";
import Footer from "./footer";

export interface LayoutProps {
  children: ReactChild | ReactChildren;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
