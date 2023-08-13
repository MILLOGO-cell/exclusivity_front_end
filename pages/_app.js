import React, { useEffect } from "react";
import { AppProvider, useAppContext } from "../context/AppContext";
import App from "next/app";
import { useRouter } from "next/router";
import allowedRoutes from "@/components/allowedRoutes";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthenticated = useAppContext();

  useEffect(() => {
    const currentRoute = router.pathname;
    const isAllowedRoute = allowedRoutes.includes(currentRoute);

    if (!isAuthenticated && !isAllowedRoute) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
