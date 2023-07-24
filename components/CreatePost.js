import React, { useRef, useState } from "react";
import {
  Box,
  Avatar,
  TextField,
  Flex,
  Modal,
  Button,
  IconButton,
} from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faVideo,
  faCalendar,
  faSmile,
  faWon,
} from "@fortawesome/free-solid-svg-icons";

const CreatePost = () => {
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [showSmileys, setShowSmileys] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleOpenGallery = (icon) => {
    setSelectedIcon(icon); // Mettre à jour l'icône sélectionnée
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    // Vérifier si une icône a été sélectionnée
    if (selectedIcon === "camera") {
      // Icône de la caméra sélectionnée : autoriser uniquement les images (image/*)
      if (selectedFile.type.startsWith("image/")) {
        // L'utilisateur a sélectionné une image
        console.log("Image sélectionnée :", selectedFile);
      } else {
        // L'utilisateur a sélectionné autre chose qu'une image
        console.log("Veuillez sélectionner une image.");
      }
    } else if (selectedIcon === "video") {
      // Icône de la vidéo sélectionnée : autoriser uniquement les vidéos (video/*)
      if (selectedFile.type.startsWith("video/")) {
        // L'utilisateur a sélectionné une vidéo
        console.log("Vidéo sélectionnée :", selectedFile);
      } else {
        // L'utilisateur a sélectionné autre chose qu'une vidéo
        console.log("Veuillez sélectionner une vidéo.");
      }
    }
    // Enregistrez le media sélectionné dans l'état
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

  return (
    <>
      <Box
        padding={4}
        color="default"
        rounding={5}
        display="flex"
        alignItems="center"
      >
        <Box>
          <Avatar src="url_de_la_photo_de_profil" name="User Photo" size="md" />
        </Box>
        <Flex flex="grow" justifyContent="center" alignItems="center">
          <Box width={800} minWidth={10} paddingX={3}>
            <button
              type="button"
              onClick={handleShowModal}
              style={{
                width: "100%",
                height: "100%",
                padding: "12px",
                border: "1px solid gray",
                borderRadius: "115px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {postText || "Écrire un poste..."}
            </button>
          </Box>
        </Flex>
      </Box>

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
                onClick={handleCloseModal}
              />
              <Button text="Annuler" inline onClick={handleCloseModal} />
            </Box>
          }
          role="alertdialog"
        >
          <Box padding={2}>
            <textarea
              id="post-text"
              placeholder="Écrire un post..."
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
                <img
                  src={URL.createObjectURL(selectedMedia)}
                  alt="Media"
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
        </Modal>
      )}
    </>
  );
};

export default CreatePost;
