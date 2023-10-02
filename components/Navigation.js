import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faUser,
  faSignOut,
  faPlus,
  faHomeUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  IconButton as GestaltIconButton,
  Modal,
  TextField,
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
import Image from "next/image";
import ModalCreator from "./ModalCreator";

const Navigation = ({ onTabChange, userPhoto, user }) => {
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
  const [activeTab, setActiveTab] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleCreator = () => {
    setShowSubscriptionModal((prev) => !prev);
  };

  const handleItemClick = (id) => {
    if (user) {
      router.push(`/profil_utilisateur?id=${id}`);
    }
  };

  const imageStyle = {
    width: "24px",
    height: "24px",
    borderRadius: "60px",
    marginRight: 12,
  };
  const UserItem = ({ user }) => (
    <div
      className={styles["user-item"]}
      onClick={() => handleItemClick(user?.id)}
    >
      <Image
        style={imageStyle}
        src={user.image ? `${BASIC_URL}${user.image}` : "/user1.png"}
        alt={user.username}
        width={24}
        height={24}
        unoptimized
      />
      <span className={styles["user-item-username"]}>{user.email}</span>
    </div>
  );

  const handleTabChange = (tabName) => {
    if (router.pathname !== "/explorer") {
      router.push(`/explorer?tab=${tabName}`);
      setActiveTab(tabName);
    } else {
      setActiveTab(tabName);
      if (onTabChange) {
        onTabChange(tabName);
      }
    }
  };

  const toggleSearchField = () => {
    setShowSearchField((prev) => !prev);
  };

  const toggleOverlayPanel = () => {
    setShowOverlayPanel((prev) => !prev);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 1200);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    setActiveTab(router.query.tab || "explorer");

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showOverlayPanel && event.target.closest(".overlay-panel")) {
        // console.log("Clicked inside of the open panel.");
        setShowOverlayPanel((prev) => !prev);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showOverlayPanel]);
  const imageUserStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "60px",
    marginRight: 12,
  };
  return (
    <>
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
        {showSubscriptionModal && (
          <ModalCreator
            userName={user?.username}
            onClose={() => setShowSubscriptionModal(false)}
          />
        )}
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
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                        width={150}
                        height={150}
                      />
                    ) : (
                      <div>
                        <FontAwesomeIcon icon={faPlus} size="3x" color="#ccc" />
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
                    onChange={({ value }) => handleInputChange("title", value)}
                    placeholder="Nom de l'événement"
                    value={eventData.title}
                  />
                  <Box display="flex" marginTop={2} justifyContent="between">
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
                    <Box marginLeft={4}>
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
                <Spinner show={isLoading} accessibilityLabel="Chargement" />
              </Box>
            )}
          </Modal>
        )}
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
                <div className="tabs">
                  <>
                    <div
                      className={`tab ${
                        router.pathname === "/explorer"
                          ? activeTab === "explorer"
                            ? "active"
                            : ""
                          : activeTab === ""
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleTabChange("explorer")}
                    >
                      Explorer
                    </div>
                    <div
                      className={`tab ${
                        router.pathname === "/explorer"
                          ? activeTab === "event"
                            ? "active"
                            : ""
                          : activeTab === ""
                          ? "active"
                          : ""
                      }`}
                      onClick={() => handleTabChange("event")}
                    >
                      Évènements
                    </div>
                  </>
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
            <div className="tabs">
              <>
                <div
                  className={`tab ${
                    router.pathname === "/explorer"
                      ? activeTab === "explorer"
                        ? "active"
                        : ""
                      : activeTab === ""
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTabChange("explorer")}
                >
                  Explorer
                </div>
                <div
                  className={`tab ${
                    router.pathname === "/explorer"
                      ? activeTab === "event"
                        ? "active"
                        : ""
                      : activeTab === ""
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleTabChange("event")}
                >
                  Évènements
                </div>
              </>
            </div>
          </>
        )}

        {/* Overlay Panel for small screens */}
        {showOverlayPanel && isSmallScreen && (
          <div
            className="overlay-panel"
            style={{
              position: "fixed",
              top: 10,
              right: 10,
              bottom: 0,
              backgroundColor: "white",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "280px",
              borderWidth: 1,
              height: "270px",
              borderRadius: 20,
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
              <div className={`${styles["user"]}`}>
                <Link
                  href="/profil"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    style={imageUserStyle}
                    src={userPhoto}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    unoptimized
                  />
                  <span style={{ fontSize: 18, color: "white" }}>
                    {user?.username}
                  </span>
                  <span />
                </Link>
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
                  <Link
                    href="/profil"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className={`${styles["overlay-link"]} ${styles["link-profile"]}`}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className={styles["link-icon"]}
                      />
                      Mon compte
                    </div>
                  </Link>
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
                  {user?.is_creator ? (
                    <div
                      className={`${styles["overlay-link-event"]} ${styles["link-new-event"]}`}
                      onClick={handleModalOpen}
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        className={styles["link-icon"]}
                      />
                      Nouvel événement
                    </div>
                  ) : (
                    <div
                      className={`${styles["overlay-link-event"]} ${styles["link-new-event"]}`}
                      onClick={handleCreator}
                    >
                      <FontAwesomeIcon
                        icon={faHomeUser}
                        className={styles["link-icon"]}
                      />
                      Devenir créateur
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "12px",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    Exclusivity © 2023. Tout droit réservé
                    <br />
                    <Link
                      href="/conditions_d_utilisation"
                      style={{ textDecoration: "underline" }}
                    >
                      Politique de confidentialité
                    </Link>
                  </div>
                </div>
                <div>Exclusivity © 2023. Tout droit réservé</div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <style jsx>{`
        .tabs {
          display: flex;
          gap: 20px;
          margin-left: 20px;
        }

        .tab {
          cursor: pointer;
          padding: 10px;
          font-size: 16px;
          color: #333;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out;
        }

        .tab.active {
          border-color: blue;
          color: blue;
        }
      `}</style>
    </>
  );
};

export default Navigation;
