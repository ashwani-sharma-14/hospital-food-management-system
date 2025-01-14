import React from "react";
import Layout from "@/components/ui/Layout";
import { AppProps } from "next/app";
import NavBar from "./NavBar";
function app({ Component, pageProps }: AppProps) {

  return (
    <Layout>
      <NavBar/>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default app;
