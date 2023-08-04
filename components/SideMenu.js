import {
  Box,
  Avatar,
  Text,
  Button,
  Modal,
  TextField,
  Column,
  TextArea,
} from "gestalt";
import "@/app/globals.css";
import IconButton from "./IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import {
  UPDATE_USER,
  UPDATE_USER_PHOTO,
  USER_DETAILS,
  BASE_URL,
  IMAGE_URL,
  API_URL,
  BASIC_URL,
} from "@/configs/api";
import axios from "axios";
const SideMenu = ({ username, fansCount, userPhoto }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const inputFileRef = useRef(null);
  const router = useRouter();
  const {
    user,
    setUser,
    setToken,
    token,
    isAuthenticated,
    setIsAuthenticated,
  } = useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, [setToken]);

  const [eventData, setEventData] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    description: "",
    media: "", // You can store the selected media URL here
  });
  const handleOpenFileSelector = () => {
    inputFileRef.current.click();
  };
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    router.push("/");
  };
  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mettez en œuvre ici la logique pour afficher l'aperçu du média sélectionné
      setSelectedMedia(file);
    }
  };
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
  }, []); // Utiliser un tableau vide pour exécuter cette mise à jour une seule fois lors du montage

  const handleUploadMedia = () => {
    // Mettez en œuvre ici la logique pour télécharger le média sélectionné
    // Par exemple, vous pouvez envoyer le fichier au backend pour le télécharger
    // Assurez-vous de réinitialiser l'état du fichier sélectionné après l'envoi
    setSelectedMedia(null);
  };

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

  const handlePublishEvent = () => {
    // Add your logic to publish the event using eventData
    // For example, you can make an API call to save the event data to the server
    console.log("Event Data:", eventData);

    // Close the modal after publishing the event
    setIsModalOpen(false);
  };
  return (
    <Box padding={4} width={310} rounding={5} color="default">
      <Box marginBottom={4} display="flex" alignItems="center">
        <Avatar src={userPhoto} name="User Photo" size="md" />
        <Box marginLeft={2} paddingX={2}>
          <Text bold>{username}</Text>
          {/* <Text color="gray" size="sm">
            {fansCount} fans
          </Text> */}
        </Box>
      </Box>
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
          onClick={handleLogout}
        />
      </Box>
      {isModalOpen && (
        <Modal
          accessibilityCloseLabel="Fermer"
          accessibilityModalLabel="Créer un événement"
          heading="Créer un événement"
          size="sm"
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
                <img
                  src={URL.createObjectURL(selectedMedia)} // Utilisez l'URL.createObjectURL pour afficher l'aperçu de l'image
                  alt="Media Preview"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
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
              id="eventName"
              name="eventName"
              onChange={({ value }) => handleInputChange("eventName", value)}
              placeholder="Nom de l'événement"
              value={eventData.eventName}
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
              <Box marginL={4}>
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
                id="eventTime"
                name="eventTime"
                type="text"
                placeholder="Lieu"
                onChange={({ value }) => handleInputChange("location", value)}
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
          {/* Add other fields (date, location, description, media preview) */}
        </Modal>
      )}

      <Box marginBottom={2}>
        {/* {userIdentity?.is_creator && ( */}
        <IconButton
          icon={<FontAwesomeIcon icon={faPlus} />}
          label="Nouvel évènement"
          buttonColor="blue"
          textColor="white"
          iconColor="white"
          iconPosition="left"
          onClick={handleModalOpen}
        />
        {/* )} */}
      </Box>
    </Box>
  );
};

export default SideMenu;
