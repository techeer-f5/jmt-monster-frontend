import type { AppProps } from "next/app";
import React from "react";
import Layout from "../components/layout";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
