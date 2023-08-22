import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faTimes,
  faUser,
  faSignOut,
  faPlus,
  faPeople,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  IconButton as GestaltIconButton,
  Modal,
  TextField,
  SearchField,
  OverlayPanel,
  SideNavigation,
  Button,
  TextArea,
  Spinner,
} from "gestalt";
import "@/app/globals.css";
import styles from "../app/pages.module.css";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/AppContext";
import { API_URL, BASIC_URL } from "@/configs/api";
import axios from "axios";
import EventPage from "./EventPage";
import ExplorerPage from "./ExplorerPage";
import Image from "next/image";

const UserItem = ({ user }) => (
  <div className={styles["user-item"]}>
    <img
      className={styles["user-item-img"]}
      src={user.image ? `${BASIC_URL}${user.image}` : "../user1.png"}
      alt={user.username}
    />
    <span className={styles["user-item-username"]}>{user.username}</span>
  </div>
);

const Navigation = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSearchField, setShowSearchField] = useState(false);
  const [showOverlayPanel, setShowOverlayPanel] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { token, logout, userList } = useAppContext();

  const toggleSearchField = () => {
    setShowSearchField((prev) => !prev);
  };

  const toggleOverlayPanel = () => {
    setShowOverlayPanel((prev) => !prev);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 768); // Mettre à jour la taille lors du redimensionnement de l'écran
  };

  // Écoutez l'événement de redimensionnement de l'écran pour déterminer si c'est un petit écran
  React.useEffect(() => {
    handleResize(); // Vérifiez la taille initiale
    window.addEventListener("resize", handleResize);

    // Nettoyez l'écouteur d'événement lorsqu'il n'est plus nécessaire
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isActive = (pathname) => {
    return router.pathname === pathname ? "active" : "";
  };

  const handleLogout = () => {
    router.push("/");
    logout();
  };

  const [eventData, setEventData] = useState({
    eventName: "",
    date: new Date(),
    time: "",
    location: "",
    description: "",
    media: "",
  });

  const handleOpenFileSelector = () => {
    inputFileRef.current.click();
  };

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedMedia(file);
    }
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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const createEvent = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("location", eventData.location);
      formData.append("content", eventData.description);
      formData.append("media", selectedMedia);

      const response = await axios.post(EVENT_POST, formData, config);
      const newEvent = response.data;

      setEventData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        media: "",
      });
      setSelectedMedia(null);

      setIsModalOpen(false);
      updateEventPosts([...eventPosts, newEvent]);
      fetchEventPosts();
    } catch (error) {
      // console.error("Erreur lors de la création de l'événement :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishEvent = () => {
    createEvent();
  };

  useEffect(() => {
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

  const handleSearchSubmit = async () => {
    if (searchValue.trim() === "") {
      return;
    }

    const response = await axios.get(
      `${API_URL}/utilisateurs/search/users/?search=${searchValue}`
    );
    const users = response.data;
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setSearchResults([]);
    } else {
      const filteredUsers = userList.filter((user) =>
        user?.username.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredUsers);
    }
  };

  return (
    <nav
      className="navigation-container"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        color: "black",
        backgroundColor: "#fff",
      }}
    >
      <div
        className="logo"
        style={{
          height: "45px",
          width: "110px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          alt="Logo"
          src="/logo.png"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          width={150}
          height={150}
        />
      </div>

      {isSmallScreen ? (
        <>
          {showSearchField ? (
            <div style={{ position: "relative", width: "100%" }}>
              <div
                className="search-box"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "white",
                  padding: "6px 12px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  border: "1px solid #ccc",
                }}
              >
                <input
                  id="search"
                  type="text"
                  placeholder="Rechercher..."
                  style={{
                    border: "none",
                    flex: "1",
                    height: "100%",
                    outline: "none",
                  }}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearchSubmit();
                    }
                  }}
                />
              </div>
              {searchResults.length > 0 && searchValue.trim() !== "" && (
                <div className={styles["search-results"]}>
                  <div>
                    {searchResults.map((user) => (
                      <UserItem key={user.id} user={user} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className="nav-link"
                style={{ margin: "0 20px", cursor: "pointer" }}
              >
                <a
                  className={`nav-link ${isActive("/explorer")}`}
                  href="explorer"
                >
                  Explorer
                </a>
              </div>
              <div
                className="nav-link"
                style={{ margin: "0 20px", cursor: "pointer" }}
              >
                <a className={`nav-link ${isActive("/event")}`} href="event">
                  {" "}
                  Évènements
                </a>
              </div>
            </>
          )}

          <div
            className="icon-button"
            style={{ cursor: "pointer", marginRight: "10px" }}
            onClick={toggleSearchField}
          >
            <FontAwesomeIcon icon={faSearch} />
          </div>

          <div
            className="icon-button"
            style={{ cursor: "pointer" }}
            onClick={toggleOverlayPanel}
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "relative", width: "100%" }}>
            <div
              className="search-box"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                borderRadius: "30px",
                backgroundColor: "white",
                padding: "6px 12px",
                border: "1px solid #ccc",
                marginLeft: "12px",
                marginRight: "2px",
              }}
            >
              <input
                id="search"
                type="text"
                placeholder="Rechercher..."
                style={{
                  border: "none",
                  flex: "1",
                  height: "100%",
                  outline: "none",
                }}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
            {searchResults.length > 0 && searchValue.trim() !== "" && (
              <div className={styles["search-results"]}>
                <div>
                  {searchResults.map((user) => (
                    <UserItem key={user.id} user={user} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div
            className="nav-link"
            style={{ margin: "0 20px", cursor: "pointer" }}
          >
            <a className={`nav-link ${isActive("/explorer")}`} href="explorer">
              Explorer
            </a>
          </div>
          <div
            className="nav-link"
            style={{ margin: "0 20px", cursor: "pointer" }}
          >
            <a className={`nav-link ${isActive("/event")}`} href="event">
              Évènements
            </a>
          </div>
        </>
      )}

      {/* Overlay Panel for small screens */}
      {showOverlayPanel && isSmallScreen && (
        <div
          className="overlay-panel"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "280px",
            borderWidth: 1,
          }}
        >
          <div
            className="overlay-title"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 15px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span style={{ fontSize: "25px" }}> Menu</span>
            <div
              className="close-icon"
              style={{
                cursor: "pointer",
              }}
              onClick={toggleOverlayPanel}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className="overlay-content">
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "90vh",
              }}
            >
              <div>
                <div
                  className={`${styles["overlay-link"]} ${styles["link-profile"]}`}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className={styles["link-icon"]}
                  />
                  Profil
                </div>
                <div
                  className={`${styles["overlay-link"]} ${styles["link-logout"]}`}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faSignOut}
                    className={styles["link-icon"]}
                  />
                  Déconnexion
                </div>
                <div
                  className={`${styles["overlay-link"]} ${styles["link-new-event"]}`}
                  onClick={handleModalOpen}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className={styles["link-icon"]}
                  />
                  Nouvel événement
                </div>
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
                    {!isLoading ? (
                      <>
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
                                src={URL.createObjectURL(selectedMedia)}
                                alt="Media Preview"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                                width={150}
                                height={150}
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
                            id="title"
                            name="title"
                            onChange={({ value }) =>
                              handleInputChange("title", value)
                            }
                            placeholder="Nom de l'événement"
                            value={eventData.title}
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
                              id="eventLocation"
                              name="eventLocation"
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
                      </>
                    ) : (
                      <Box
                        position="absolute"
                        top
                        left
                        right
                        bottom
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        zIndex={0}
                      >
                        <Spinner
                          show={isLoading}
                          accessibilityLabel="Chargement"
                        />
                      </Box>
                    )}
                  </Modal>
                )}
              </div>
              <div>Exclusivity © 2023. Tout droit réservé</div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
