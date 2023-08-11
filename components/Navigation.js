import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Box,
  // Image,
  IconButton as GestaltIconButton,
  Modal,
  TextField,
  SearchField,
  OverlayPanel,
  SideNavigation,
  Button,
  TextArea,
} from "gestalt";
import "@/app/globals.css";
import IconButton from "../components/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
const Navigation = () => {
  const router = useRouter();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSearchField, setShowSearchField] = useState(false);
  const [showOverlayPanel, setShowOverlayPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const inputFileRef = useRef(null);
  const { setUser, setToken, user, token } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    router.push("/");
  };

  const [eventData, setEventData] = useState({
    eventName: "",
    date: new Date(),
    time: "",
    location: "",
    description: "",
    media: "", // You can store the selected media URL here
  });
  const handleOpenFileSelector = () => {
    inputFileRef.current.click();
  };

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mettez en œuvre ici la logique pour afficher l'aperçu du média sélectionné
      setSelectedMedia(file);
    }
  };
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
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = (name, value) => {
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePublishEvent = () => {
    // Add your logic to publish the event using eventData
    // For example, you can make an API call to save the event data to the server
    console.log("Event Data:", eventData);

    // Close the modal after publishing the event
    setIsModalOpen(false);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleOpenOverlayPanel = () => {
    setShowOverlayPanel(true);
    console.log("Opening overlay panel");
  };
  const handleCloseOverlayPanel = () => {
    setShowOverlayPanel(false);
  };
  const overlayPanelStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Couleur d'arrière-plan semi-transparente
    zIndex: 999, // Définir une valeur de zIndex élevée pour placer le OverlayPanel au-dessus du contenu de la page
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const handleChange = () => {};
  useEffect(() => {
    // Mettre à jour la date et l'heure actuelles comme placeholder lorsque le composant est monté
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setEventData((prevData) => ({
      ...prevData,
      date: currentDate,
      time: currentTime,
    }));
  }, []);
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

          {/* <Box style={userBoxStyle}> */}
          <GestaltIconButton
            accessibilityLabel="Utilisateur"
            icon="menu"
            size="md"
            onClick={handleOpenOverlayPanel}
          />
          {showOverlayPanel && isSmallScreen && (
            <div style={overlayPanelStyle}>
              <OverlayPanel
                show={showOverlayPanel}
                role="menu"
                anchor={null}
                onDismiss={handleCloseOverlayPanel}
                positionRelativeToAnchor={false}
                heading="Menu"
                size=""
              >
                <SideNavigation>
                  <SideNavigation.TopItem
                    href="/profil"
                    // onClick={({ event }) => event.preventDefault()}
                    label="Profil"
                    icon="person"
                  />
                  <SideNavigation.TopItem
                    href="#"
                    onClick={handleLogout}
                    label="Déconnexion"
                    icon="logout"
                  />
                  <SideNavigation.TopItem
                    // href="#"
                    // onClick={({ event }) => event.preventDefault()}
                    label="Nouvel évènement"
                    icon="add"
                    onClick={handleModalOpen}
                  />
                  <SideNavigation.TopItem
                    // href="#"
                    // onClick={({ event }) => event.preventDefault()}
                    label="Mes abonnements"
                    icon="people"
                    onClick={() => {}}
                  />
                </SideNavigation>
                {isModalOpen && (
                  <Modal
                    accessibilityCloseLabel="Fermer"
                    accessibilityModalLabel="Créer un événement"
                    heading="Créer un événement"
                    size="sm"
                    onDismiss={handleModalClose}
                    footer={
                      <Box display="flex" justifyContent="end">
                        <Button
                          text="Publier"
                          color="red"
                          onClick={handlePublishEvent}
                        />
                        <Box marginLeft={2}>
                          <Button text="Annuler" onClick={handleModalClose} />
                        </Box>
                      </Box>
                    }
                    role="alertdialog"
                  >
                    <Box marginTop={4} marginBottom={4}>
                      {/* Media preview */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "150px",
                          border: "1px dashed #000",
                          marginBottom: "2px",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onClick={handleOpenFileSelector}
                      >
                        {selectedMedia ? (
                          <Image
                            src={URL.createObjectURL(selectedMedia)} // Utilisez l'URL.createObjectURL pour afficher l'aperçu de l'image
                            alt="Media Preview"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        ) : (
                          <div>
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="3x"
                              color="#ccc"
                            />
                          </div>
                        )}
                      </div>
                      {/* Sélecteur de fichiers caché */}
                      <input
                        type="file"
                        ref={inputFileRef}
                        style={{ display: "none" }}
                        accept="image/*, video/*" // Acceptez à la fois les images et les vidéos
                        onChange={handleMediaChange}
                      />
                    </Box>
                    <Box
                      marginTop={4}
                      display="flex"
                      alignItems="start"
                      direction="column"
                    >
                      <TextField
                        id="eventName"
                        name="eventName"
                        onChange={({ value }) =>
                          handleInputChange("eventName", value)
                        }
                        placeholder="Nom de l'événement"
                        value={eventData.eventName}
                      />
                      <Box
                        display="flex"
                        marginTop={2}
                        justifyContent="between"
                      >
                        <Box marginEnd={2}>
                          <TextField
                            id="eventDate"
                            name="eventDate"
                            type="date"
                            onChange={({ value }) =>
                              handleInputChange("date", value)
                            }
                            value={eventData.date}
                          />
                        </Box>
                        <Box marginL={4}>
                          <TextField
                            id="eventTime"
                            name="eventTime"
                            type="time"
                            onChange={({ value }) =>
                              handleInputChange("time", value)
                            }
                            value={eventData.time}
                          />
                        </Box>
                      </Box>
                      <Box marginTop={2}>
                        <TextField
                          id="eventTime"
                          name="eventTime"
                          type="text"
                          placeholder="Lieu"
                          onChange={({ value }) =>
                            handleInputChange("location", value)
                          }
                          value={eventData.location}
                        />
                      </Box>
                      <Box marginTop={2} width="100%">
                        <TextArea
                          id="eventDescription"
                          name="eventDescription"
                          type="text"
                          placeholder="Description"
                          onChange={({ value }) =>
                            handleInputChange("description", value)
                          }
                          value={eventData.description}
                        />
                      </Box>
                    </Box>
                  </Modal>
                )}
              </OverlayPanel>
            </div>
          )}
        </Box>
      ) : (
        // </Box>
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
    </Box>
  );
};

export default Navigation;
