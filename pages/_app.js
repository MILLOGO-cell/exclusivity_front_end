// pages/_app.js
import React, { useEffect } from "react";
import { AppProvider, useAppContext } from "../context/AppContext";
import App from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthenticated = useAppContext();
  const isHomePage = router.pathname === "/";

  //   useEffect(() => {
  //     // Si l'utilisateur n'est pas connecté et qu'il n'est pas sur la page d'accueil, redirigez-le vers la page d'accueil
  //     if (!isAuthenticated && !isHomePage) {
  //       router.push("/");
  //     }
  //   }, [isAuthenticated, isHomePage, router]);

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
