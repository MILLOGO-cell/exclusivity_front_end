import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  TextField,
  Flex,
  Modal,
  Button,
  IconButton,
  Spinner,
} from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { SIMPLE_POST, BASIC_URL } from "@/configs/api";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useRouter } from "next/router";
import allowedRoutes from "./allowedRoutes";

const CreatePost = ({ userPhoto }) => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [showSmileys, setShowSmileys] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    user,
    setUser,
    setToken,
    token,
    setIsAuthenticated,
    updatePosts,
    fetchPosts,
  } = useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);

    // Mettre à jour le statut d'authentification dans le contexte
    setIsAuthenticated(storedIsAuthenticated);

    // Maintenant que le statut d'authentification est mis à jour dans le contexte,
    // vous pouvez exécuter la vérification de l'authentification dans votre middleware
    if (!storedIsAuthenticated && !allowedRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [setIsAuthenticated, setToken, setUser, setUserIdentity]);

  const handleOpenGallery = (icon) => {
    setSelectedIcon(icon);
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedIcon === "camera") {
      if (selectedFile.type.startsWith("image/")) {
        console.log("Image sélectionnée :", selectedFile);
      } else {
        console.log("Veuillez sélectionner une image.");
      }
    } else if (selectedIcon === "video") {
      if (selectedFile.type.startsWith("video/")) {
        console.log("Vidéo sélectionnée :", selectedFile);
      } else {
        console.log("Veuillez sélectionner une vidéo.");
      }
    }
    setSelectedMedia(selectedFile);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleModalOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };
  const handleInputChange = (event) => {
    setPostText(event.target.value);
  };

  const handleShowSmileys = () => {
    setShowSmileys(true);
  };

  const handleHideSmileys = () => {
    setShowSmileys(false);
  };

  const handleInsertSmiley = (smiley) => {
    setPostText((prevText) => prevText + smiley);
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    try {
      // Créer un objet de données pour envoyer les détails du post
      const postData = new FormData();
      postData.append("content", postText);
      // Ajouter le média au FormData s'il est sélectionné
      if (selectedMedia) {
        postData.append("media", selectedMedia);
      }

      const response = await axios.post(SIMPLE_POST, postData, {
        headers: {
          Authorization: `Bearer ${token}`, // Remplacez yourAuthToken par le token d'authentification de votre utilisateur
        },
      });

      // Vérifier si la création du post a réussi
      if (response.status === 201) {
        const newPost = {
          id: response.data.id,
          content: postText,
          media: selectedMedia,
          user: {
            id: user.id,
            name: user.username,
            // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
          },
          // Ajoutez d'autres propriétés du post si nécessaire
        };

        updatePosts(newPost);
        fetchPosts();
        // Réinitialiser les états pour vider le modal après la publication
        setPostText("");
        setSelectedIcon("");
        setSelectedMedia(null);
        setIsLoading(false);
        handleCloseModal();
      } else {
        console.log("Une erreur s'est produite lors de la création du post.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(
        "Une erreur s'est produite lors de la création du post :",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };
  const imageStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "60px",
    marginRight: 12,
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: 10,
          borderRadius: 15,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Image
          style={imageStyle}
          src={userPhoto || "/user1.png"}
          alt="User Avatar"
          width={50}
          height={50}
          unoptimized
        />
        <div style={{ width: "100%" }}>
          {userIdentity?.username && (
            <button
              type="button"
              onClick={handleShowModal}
              style={{
                width: "100%",
                height: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "115px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {postText || `Quoi de neuf ${userIdentity?.username} ?`}
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          accessibilityModalLabel="Créer un post"
          heading="Créer un post"
          onDismiss={handleCloseModal}
          size="sm"
          footer={
            <Box display="flex" justifyContent="end">
              <Button
                text="Publier"
                inline
                color="red"
                onClick={handleCreatePost}
              />
              <Button text="Annuler" inline onClick={handleCloseModal} />
            </Box>
          }
          role="alertdialog"
        >
          {!isLoading ? (
            <Box padding={2}>
              <textarea
                id="post-text"
                placeholder="Écrire un quelque chose..."
                value={postText}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  resize: "none",
                }}
              />
              {/* Afficher le média sélectionné dans la zone de texte du modal */}
              {selectedMedia && selectedIcon === "camera" && (
                <>
                  <Image
                    src={URL.createObjectURL(selectedMedia)}
                    alt="Media"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                    width={150}
                    height={150}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <span>Média sélectionné</span>
                    <IconButton
                      icon={"cancel"}
                      size="sm"
                      bgColor="gray"
                      onClick={() => setSelectedMedia(null)}
                    />
                  </div>
                </>
              )}
              {selectedMedia && selectedIcon === "video" && (
                <>
                  <video
                    src={URL.createObjectURL(selectedMedia)}
                    controls
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <span>Média sélectionné</span>
                    <IconButton
                      icon={"cancel"}
                      size="sm"
                      bgColor="gray"
                      onClick={() => setSelectedMedia(null)}
                    />
                  </div>
                </>
              )}
              <Box paddingY={2}>
                <Flex
                  display="flex"
                  direction="row"
                  justifyContent="center"
                  gap={2}
                  alignSelf="center"
                  width="100%"
                >
                  <div
                    role="button"
                    onClick={() => handleOpenGallery("camera")}
                    className="ml-2"
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faImage} size="2x" />
                    <div>Photo</div>
                  </div>
                  <div
                    role="button"
                    onClick={() => handleOpenGallery("video")}
                    className="ml-2"
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faVideo} size="2x" />
                    <div>Vidéo</div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={selectedIcon === "camera" ? "image/*" : "video/*"}
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </Flex>
              </Box>
            </Box>
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
    </>
  );
};

export default CreatePost;
