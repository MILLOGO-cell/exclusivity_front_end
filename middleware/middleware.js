import React, { useEffect } from "react";
import { useRouter } from "next/router";
import allowedRoutes from "@/components/allowedRoutes";
import { useAppContext } from "@/context/AppContext";

const NavigationMiddleware = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    if (!isAuthenticated && !allowedRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [isAuthenticated, router.pathname]);

  return <>{children}</>;
};

export default NavigationMiddleware;
