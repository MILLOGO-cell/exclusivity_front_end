import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "../app/Navbar.module.css"; // Importez votre fichier CSS pour les styles personnalisés
import "@/app/globals.css";
import Image from "next/image";
import { Box, Button, Modal, IconButton, OverlayPanel } from "gestalt";

const Navbar = ({ onLoginButtonClick, onRegisterButtonClick }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleOpenLoginForm = () => {
    setShowLoginForm(true);
  };

  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };

  const handleOpenRegisterForm = () => {
    setShowRegisterForm(true);
  };

  const handleCloseRegisterForm = () => {
    setShowRegisterForm(false);
  };

  useEffect(() => {
    function handleResize() {
      // Utilisez la largeur de l'écran pour déterminer le bouton de taille appropriée
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        // Large écran (lg)
        document.documentElement.style.setProperty("--button-size", "lg");
      } else if (screenWidth >= 768) {
        // Écran moyen (md)
        document.documentElement.style.setProperty("--button-size", "md");
      } else {
        // Petit écran (sm)
        document.documentElement.style.setProperty("--button-size", "sm");
      }
    }

    // Exécution initiale
    handleResize();

    // Écoutez les changements de taille de fenêtre
    window.addEventListener("resize", handleResize);

    // Nettoyez l'écouteur d'événement lors du démontage du composant
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.logoContainer}>
        <Image
          alt="Logo"
          src="/Logo.png"
          width={110}
          height={45}
          style={{
            width: "110px",
            height: "45px",
            alignSelf: "flex-start",
            marginRight: "auto",
          }}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.connectButton} onClick={onLoginButtonClick}>
          Se connecter
        </button>
        <button
          className={styles.registeringButton}
          onClick={onRegisterButtonClick}
        >
          S&apos;inscrire
        </button>
      </div>
    </div>
  );
};

export default Navbar;
