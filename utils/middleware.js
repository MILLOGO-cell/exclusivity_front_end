// middleware/authMiddleware.js
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

const requireAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { isAuthenticated } = useAppContext(); // Utilisez le hook useAppContext pour accéder à l'état isAuthenticated du contexte

    useEffect(() => {
      if (!isAuthenticated && router.pathname !== "/") {
        router.push("/"); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      }
    }, [isAuthenticated, router]);

    // Si l'utilisateur est connecté, renvoyer le composant sans modification
    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // Si l'utilisateur n'est pas connecté, le middleware aura déjà redirigé l'utilisateur vers la page d'accueil
    // Nous pouvons renvoyer null ici pour empêcher le rendu du composant
    return null;
  };
};

export default requireAuth;
