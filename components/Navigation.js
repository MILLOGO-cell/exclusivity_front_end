import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Image,
  IconButton as GestaltIconButton,
  Modal,
  Sheet,
  TextField,
  SearchField,
  Button,
} from "gestalt";
import { useRouter } from "next/router";
import "@/app/globals.css";
import IconButton from "../components/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showSearchField, setShowSearchField] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSmallScreen(window.innerWidth < 1290); // Mettre à jour la taille initiale

      function handleResize() {
        setIsSmallScreen(window.innerWidth < 1290); // Mettre à jour la taille lors du redimensionnement de l'écran
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handleToggleSearchField = () => {
    setShowSearchField((prevState) => !prevState);
  };
  const handleToggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };
  const logoStyle = {
    width: "100%",
    height: "auto",
    alignSelf: "flex-start",
  };

  const isActive = (pathname) => {
    return router.pathname === pathname ? "active" : "";
  };

  const searchBoxStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    borderRadius: "30px",
    backgroundColor: "white",
    padding: "6px 12px",
  };

  const userBoxStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  };

  const handleOpenSheet = () => {
    setShowSheet(true);
  };

  const handleCloseSheet = () => {
    setShowSheet(false);
  };

  const handleChange = () => {};

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="between"
      paddingY={3}
      paddingX={6}
      color="default"
      backgroundColor="darkGray"
      borderStyle="sm"
    >
      <Box
        marginRight={3}
        height={45}
        width={110}
        alignItems="center"
        justifyContent="center"
        style={logoStyle}
        marginEnd={2}
      >
        <Image
          alt="Logo"
          src="/logo.png"
          fit="contain"
          naturalHeight={1}
          naturalWidth={1}
        />
      </Box>

      {/* Afficher l'icône de recherche avec une loupe à côté de l'icône de l'utilisateur sur les petits écrans */}
      {isSmallScreen ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          {showSearchField ? (
            // Show the search field when showSearchField is true
            <SearchField
              id="search"
              type="text"
              placeholder="Rechercher..."
              size="md"
              onChange={handleChange} // Make sure to define the handleChange function to handle the search field input changes
            />
          ) : (
            // Show the links "Explorer" and "Événements" when showSearchField is false
            <>
              <Box flex="none" marginStart={0}>
                <a
                  className={`nav-link ${isActive("/explorer")}`}
                  href="explorer"
                >
                  Explorer
                </a>
              </Box>
              <Box flex="none" marginStart={3} marginEnd={5}>
                <a className={`nav-link ${isActive("/event")}`} href="event">
                  Événements
                </a>
              </Box>
            </>
          )}
          <GestaltIconButton
            accessibilityLabel="Rechercher"
            icon="search"
            size="md"
            marginRight={2}
            onClick={handleToggleSearchField}
          />

          <Box style={userBoxStyle} onClick={handleToggleDropdown}>
            <GestaltIconButton
              accessibilityLabel="Utilisateur"
              icon="person"
              size="md"
              onClick={handleToggleDropdown}
            />
          </Box>
          {/* Show the dropdown when showDropdown is true */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                right: "20px",
                top: "40px",
                backgroundColor: "white",
                padding: "12px",
                marginTop: "20px",
                borderRadius: "20px",
              }}
            >
              <ul>
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <IconButton
                      icon={<FontAwesomeIcon icon={faUser} />}
                      label="Mon profil"
                      buttonColor="white"
                      textColor="black"
                      iconColor="black"
                      iconPosition="left"
                      href="/profil"
                    />
                  </Box>
                  <IconButton
                    icon={<FontAwesomeIcon icon={faSignOut} />}
                    label="Déconnexion"
                    buttonColor="white"
                    textColor="red"
                    iconColor="red"
                    iconPosition="left"
                  />
                </Box>

                <Box marginBottom={2}>
                  <IconButton
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    label="Nouvelle publication"
                    buttonColor="blue"
                    textColor="white"
                    iconColor="white"
                    iconPosition="left"
                  />
                </Box>
              </ul>
            </div>
          )}
        </Box>
      ) : (
        // Afficher le champ de recherche et les liens Explorer et Événements seulement sur les grands écrans
        <>
          <Box flex="grow" marginRight={3} marginLeft={3}>
            <TextField
              id="search"
              type="text"
              placeholder="Rechercher..."
              size="lg"
            />
          </Box>
          <Box flex="none" marginStart={3}>
            <a className={`nav-link ${isActive("/explorer")}`} href="explorer">
              Explorer
            </a>
          </Box>
          <Box flex="none" marginStart={3}>
            <a className={`nav-link ${isActive("/event")}`} href="event">
              Événements
            </a>
          </Box>
        </>
      )}

      {/* Ajouter le composant de la Sheet */}
      {showSheet && (
        <Sheet
          accessibilityDismissLabel="Fermer"
          onDismiss={handleCloseSheet}
          heading="Mon compte"
          size="md"
        >
          {/* Contenu de la Sheet */}
          {/* Vous pouvez afficher les détails de l'utilisateur ici */}
        </Sheet>
      )}
      <style jsx>{`
        .nav-link {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }

        .active {
          color: blue;
          text-decoration: underline;
          font-weight: SemiBold;
        }
      `}</style>
    </Box>
  );
};

export default Navigation;
