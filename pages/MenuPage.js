import React from "react";
import Link from "next/link";
import { Box, IconButton } from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MenuPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        {/* Bouton de retour */}
        <IconButton
          accessibilityLabel="Retour"
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          size="md"
        >
          <Link href="/">
            {/* Lien vers la page d'accueil ou une autre page si nécessaire */}
            <a>Retour</a>
          </Link>
        </IconButton>
      </div>
      <div>
        {/* Titre de la page */}
        <h1>Menu</h1>
      </div>
      <div>{/* Ajoutez ici les éléments de votre menu */}</div>
    </div>
  );
};

export default MenuPage;
