// pages/_app.js
import React, { useEffect } from "react";
import { AppProvider, useAppContext } from "../context/AppContext";
import App from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthenticated = useAppContext();
  const isHomePage = router.pathname === "/";

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
