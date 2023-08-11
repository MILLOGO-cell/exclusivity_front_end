import {
  Box,
  Avatar,
  Text,
  Button,
  Modal,
  TextField,
  Column,
  TextArea,
  Spinner,
} from "gestalt";
import "@/app/globals.css";
import IconButton from "./IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/router";
import { EVENT_POST, API_URL } from "@/configs/api";
import axios from "axios";
import Image from "next/image";

const SideMenu = ({ username, fansCount, userPhoto }) => {
  const [isLoading, setIsLoading] = useState(false);
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
    fetchEventPosts,
    updateEventPosts,
    eventPosts,
    setPosts,
    setEventPosts,
    logout,
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
    title: "",
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
    router.push("/");
    logout();
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
    setIsLoading(true);
    try {
      if (!token) {
        console.error("Utilisateur non authentifié.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Créer un objet FormData pour envoyer les données de l'événement, y compris le média sélectionné
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("location", eventData.location);
      formData.append("content", eventData.description);
      formData.append("media", selectedMedia); // Ajouter le média sélectionné ici

      // Envoyer la requête POST avec les données de l'événement
      const response = await axios.post(EVENT_POST, formData, config);
      // Récupérer les informations du nouvel événement depuis la réponse du serveur
      const newEvent = response.data;
      // Réinitialiser l'état des données de l'événement et du média après la création réussie de l'événement
      setEventData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        media: "",
      });
      setSelectedMedia(null);

      // Fermer le modal après la création réussie de l'événement
      setIsModalOpen(false);
      updateEventPosts([...eventPosts, newEvent]);
      // Mise à jour des publications d'événements
      fetchEventPosts();
    } catch (error) {
      console.error("Erreur lors de la création de l'événement :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishEvent = () => {
    createEvent();
  };

  return (
    <Box padding={4} width={250} rounding={5} color="default">
      <Box marginBottom={4} display="flex" alignItems="center">
        <Avatar src={userPhoto} name="User Photo" size="md" />
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
        {userIdentity?.is_creator && (
          <IconButton
            icon={<FontAwesomeIcon icon={faPlus} />}
            label="Nouvel évènement"
            buttonColor="blue"
            textColor="white"
            iconColor="white"
            iconPosition="left"
            onClick={handleModalOpen}
          />
        )}
      </Box>
    </Box>
  );
};

export default SideMenu;
