import {
  Box,
  Text,
  Button,
  Modal,
  TextField,
  TextArea,
  Spinner,
} from "gestalt";
import "@/app/globals.css";
import IconButton from "./IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSignOut,
  faUser,
  faHomeUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { EVENT_POST, API_URL } from "@/configs/api";
import axios from "axios";
import allowedRoutes from "./allowedRoutes";
import jwtDecode from "jwt-decode";
import Image from "next/image";
import ModalCreator from "./ModalCreator";

const SideMenu = ({ username, fansCount, userPhoto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const {
    setUser,
    setToken,
    token,
    setIsAuthenticated,
    fetchEventPosts,
    updateEventPosts,
    eventPosts,
    logout,
  } = useAppContext();

  const [userIdentity, setUserIdentity] = useState(null);

  const handleCreator = () => {
    setShowSubscriptionModal(true);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
    setIsAuthenticated(storedIsAuthenticated);

    if (!storedIsAuthenticated && !allowedRoutes.includes(router.pathname)) {
      router.push("/");
    }
    try {
      const tokenData = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (tokenData.exp < currentTime) {
        router.push("/");
      }
    } catch (error) {}
  }, [token]);

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    media: "",
  });

  const handleOpenFileSelector = () => {
    inputFileRef.current.click();
  };

  const handleLogout = () => {
    router.push("/");
    logout();
  };

  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedMedia(file);
    }
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (name, value) => {
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createEvent = async () => {
    if (
      !eventData.title ||
      !eventData.date ||
      !eventData.time ||
      !eventData.location ||
      !eventData.description ||
      !selectedMedia
    ) {
      setModalErrorMessage("Veuillez remplir tous les champs du formulaire !");
      return;
    }
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
  const imageStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "60px",
    marginRight: 12,
  };
  return (
    <Box padding={4} width={300} rounding={5} color="default">
      <Box marginBottom={4} display="flex" alignItems="center">
        <Image
          style={imageStyle}
          src={userPhoto || "/user1.png"}
          alt="image"
          width={50}
          height={50}
          unoptimized
        />
        <Box marginLeft={2} paddingX={2}>
          <Text bold>{username}</Text>
          <Text color="gray" size="sm">
            {fansCount} fans
          </Text>
        </Box>
      </Box>
      <Box marginBottom={2}>
        <Box marginBottom={2}>
          <IconButton
            icon={<FontAwesomeIcon icon={faUser} />}
            label="Mon compte"
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
          onClick={handleLogout}
        />
      </Box>
      {isModalOpen && (
        <Modal
          accessibilityCloseLabel="Fermer"
          accessibilityModalLabel="Créer un évènement"
          heading="Créer un évènement"
          size={400}
          onDismiss={handleModalClose}
          footer={
            <Box display="flex" justifyContent="end">
              <Button text="Publier" color="red" onClick={handlePublishEvent} />
              <Box marginLeft={2}>
                <Button text="Annuler" onClick={handleModalClose} />
              </Box>
            </Box>
          }
          role="alertdialog"
        >
          {!isLoading ? (
            <>
              {modalErrorMessage && (
                <p
                  style={{
                    color: "red",
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    paddingBottom: "2px",
                    fontSize: 18,
                  }}
                >
                  {modalErrorMessage}
                </p>
              )}
              <Box justifyContent="center" alignItems="center" display="flex">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "150px",
                    width: "350px",
                    border: "1px dashed #000",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={handleOpenFileSelector}
                >
                  {selectedMedia ? (
                    <Image
                      src={URL.createObjectURL(selectedMedia)}
                      alt="Media Preview"
                      style={{ width: "400px", height: "100%" }}
                      width={200}
                      height={90}
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
                  accept="image/*, video/*"
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
                      onChange={({ value }) => handleInputChange("date", value)}
                      value={eventData.date}
                    />
                  </Box>
                  <Box>
                    <TextField
                      id="eventTime"
                      name="eventTime"
                      type="time"
                      onChange={({ value }) => handleInputChange("time", value)}
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

      <Box marginBottom={2}>
        {userIdentity?.is_creator ? (
          <IconButton
            icon={<FontAwesomeIcon icon={faPlus} />}
            label="Nouvel évènement"
            buttonColor="blue"
            textColor="white"
            iconColor="white"
            iconPosition="left"
            onClick={handleModalOpen}
          />
        ) : (
          <IconButton
            icon={<FontAwesomeIcon icon={faHomeUser} />}
            label="Devenir créateur"
            buttonColor="blue"
            textColor="white"
            iconColor="white"
            iconPosition="left"
            onClick={handleCreator}
          />
        )}
      </Box>
      {showSubscriptionModal && (
        <ModalCreator
          userName={username}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </Box>
  );
};

export default SideMenu;
