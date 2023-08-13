import React, { useEffect } from "react";
import App from "next/app";
import { useRouter } from "next/router";
import { AppProvider, useAppContext } from "@/context/AppContext";
import NavigationMiddleware from "@/middleware/middleware";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <AppProvider>
        <NavigationMiddleware>
          <Component {...pageProps} />
        </NavigationMiddleware>
      </AppProvider>
    );
  }
}
export default MyApp;
