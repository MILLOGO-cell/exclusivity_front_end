import React, { useEffect, useState } from "react";
import { Box, Image, Button, Modal, IconButton, OverlayPanel } from "gestalt";
import Logo from "../public/logo.png";
import "@/app/globals.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Navbar = () => {
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
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 100,
  };

  const logoStyle = {
    width: "100%",
    height: "auto",
    alignSelf: "flex-start",
  };
  const modalStyle = {
    zIndex: 9999, // Valeur de zIndex de votre choix
  };
  const [buttonSize, setButtonSize] = useState("lg");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Exécution côté client uniquement
      setButtonSize(getButtonSize());

      function handleResize() {
        setButtonSize(getButtonSize());
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  function getButtonSize() {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) {
      return "lg";
    } else if (screenWidth >= 768) {
      return "md";
    } else {
      return "sm";
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      lgMarginEnd={12}
      lgMarginStart={12}
      lgMarginTop={12}
      lgPaddingX={12}
      mdMarginEnd={12}
      mdMarginStart={12}
      mdMarginTop={12}
      mdPaddingX={12}
      smMarginEnd={6}
      smMarginStart={6}
      smMarginTop={6}
      smPaddingX={6}
      color="white"
      // backgroundColor="darkGray"
      style={navbarStyle}
    >
      <Box flex="grow">
        <Box
          height={45}
          width={110}
          alignItems="center"
          justifyContent="center"
          style={logoStyle}
        >
          <Image
            alt="Logo"
            src="../logo.png"
            fit="contain"
            naturalHeight={1}
            naturalWidth={1}
            width={150}
            height={150}
          />
        </Box>
      </Box>
      <Box display="flex" width={230} justifyContent="between">
        <Button
          text="Se connecter"
          color="red"
          size={buttonSize}
          onClick={handleOpenLoginForm}
        />
        <Button
          text="S'inscrire"
          color="white"
          size={buttonSize}
          onClick={handleOpenRegisterForm}
        />
      </Box>
      {showLoginForm && (
        <div style={modalStyle}>
          <Modal
            accessibilityCloseLabel="Fermer"
            accessibilityModalLabel="Formulaire de connexion"
            onDismiss={handleCloseLoginForm}
            size={350}
          >
            <Box padding={4}>
              <LoginForm handleCloseLoginForm={handleCloseLoginForm} />
            </Box>
          </Modal>
        </div>
      )}
      {showRegisterForm && (
        <div style={modalStyle}>
          <Modal
            accessibilityCloseLabel="Fermer"
            accessibilityModalLabel="Formulaire d'inscription"
            onDismiss={handleCloseRegisterForm}
            size={400}
          >
            <Box padding={4}>
              <RegisterForm
                handleCloseRegisterForm={handleCloseRegisterForm}
                showCloseButton={true}
              />
            </Box>
          </Modal>
        </div>
      )}
    </Box>
  );
};

export default Navbar;
