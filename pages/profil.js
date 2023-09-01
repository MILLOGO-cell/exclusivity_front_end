import React, { useState, useContext, useEffect } from "react";
import styles from "../app/ProfilePage.module.css";
import IconButton from "@/components/IconButton";
import CustomButton from "@/components/NickButton";
import {
  Box,
  Button,
  Flex,
  IconButton as GestaltIconButton,
  TextField,
} from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import "@/app/globals.css";
import Navigation from "@/components/Navigation";
import { useAppContext } from "../context/AppContext";
import {
  UPDATE_USER,
  UPDATE_USER_PHOTO,
  USER_DETAILS,
  API_URL,
  BASIC_URL,
} from "@/configs/api";
import axios from "axios";
import allowedRoutes from "@/components/allowedRoutes";
import { useRouter } from "next/router";
import Image from "next/image";

const ProfilePage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { user, setUser, token, setToken, setIsAuthenticated } =
    useAppContext();
  const [username, setUsername] = useState("");
  const [last_name, setLastName] = useState("");
  const [first_name, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [userImage, setUserImage] = useState("");
  const router = useRouter();

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
  }, [token, router, setIsAuthenticated, setToken, setUser]);

  const [userDetails, setUserDetails] = useState(null);

  const getUserImage = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/utilisateurs/get_image_url/${userIdentity.id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        const imageUrl = `${BASIC_URL}${data.image_url}`;
        setUserImage(imageUrl);
      } else {
        console.log("Nous n'avons pas pu recuperer l'url de l'image");
      }
    } catch (error) {
      console.log(
        "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil.",
        error
      );
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(USER_DETAILS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setUserDetails(data);
        setUsername(data.user_details.username);

        setLastName(data.user_details.last_name);
        setFirstName(data.user_details.first_name);
        setEmail(data.user_details.email);
        setTelephone(data.user_details.telephone);
        getUserImage();
      } else {
        // console.log(
        //   "Erreur lors de la récupération des détails de l'utilisateur:",
        //   response.data
        // );
      }
    } catch (error) {
      // console.log(
      //   "Une erreur s'est produite lors de la récupération des détails de l'utilisateur:",
      //   error
      // );
    }
  };

  useEffect(() => {
    if (user && userIdentity) {
      fetchUserDetails();
    }
  }, [user, token, userIdentity]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username,
      last_name,
      first_name,
      email,
      telephone,
    };
    try {
      setIsLoading(true);

      const response = await axios.put(UPDATE_USER, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // console.log(
        //   "Informations de l'utilisateur mises à jour:",
        //   response.data
        // );
        fetchUserDetails();
      } else {
        // console.log(
        //   "Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur."
        // );
      }
    } catch (error) {
      // console.log(
      //   "Une erreur s'est produite lors de la mise à jour des informations de l'utilisateur:",
      //   error
      // );
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = () => {};

  const handleUploadPhoto = async () => {
    if (selectedPhoto) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", selectedPhoto);

        const response = await fetch(UPDATE_USER_PHOTO, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.status === 200) {
          setSelectedPhoto(null);
          fetchUserDetails();
        } else {
          console.log(
            "Une erreur s'est produite lors de la mise à jour de la photo de profil."
          );
        }
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la mise à jour de la photo de profil.",
          error
        );
      } finally {
        setLoading(false);
      }
    }
  };
  const imageStyle = {
    borderRadius: "50%",
  };
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box>
        <Navigation userPhoto={userImage} user={userIdentity} />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
          minHeight: "100vh",
        }}
      >
        <h1 className={styles.pageTitle}>Mon profil</h1>
        <div className={styles.profileContainer}>
          <div className={styles.profileInfo}>
            <div className={styles.profilePhotoContainer}>
              <div className={styles.profileBox}>
                <div className={styles.photoTitle}>Photo de profil</div>
                <label
                  htmlFor="photoInput"
                  className={styles.profilePhotoLabel}
                >
                  <Image
                    src={
                      selectedPhoto
                        ? URL.createObjectURL(selectedPhoto)
                        : userImage === `${BASIC_URL}null` || userImage === null
                        ? "/user1.png"
                        : userImage
                    }
                    alt="Photo de profil"
                    style={imageStyle}
                    width={150}
                    height={150}
                    unoptimized
                  />
                </label>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
                <div className={styles.buttonsContainer}>
                  <Button
                    text={loading ? "chargement ..." : "Changer de profil"}
                    color="gray"
                    onClick={handleUploadPhoto}
                    disabled={!selectedPhoto}
                  />
                  <GestaltIconButton
                    icon="trash-can"
                    size="md"
                    iconColor="red"
                    onClick={handleRemovePhoto}
                  />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formTitle}>Informations personnelles</div>
              <Box display="flex" direction="column" padding={2} width="100%">
                <Box marginBottom={3}>
                  <TextField
                    id="username"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={({ value }) => setUsername(value)}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="nom"
                    name="nom"
                    placeholder="Nom"
                    value={last_name}
                    onChange={({ value }) => setLastName(value)}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="prenom"
                    name="prenom"
                    placeholder="Prénom"
                    value={first_name}
                    onChange={({ value }) => setFirstName(value)}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="email"
                    name="email"
                    placeholder={email}
                    type="email"
                    value={email}
                    onChange={({ value }) => setEmail(value)}
                    size="lg"
                    disabled
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="telephone"
                    name="telephone"
                    placeholder="Téléphone"
                    value={telephone}
                    onChange={({ value }) => setTelephone(value)}
                  />
                </Box>
                <CustomButton
                  text={isLoading ? "Chargement en cours..." : "Enregistrer"}
                  buttonColor="gray"
                  type="submit"
                  rounded
                />
              </Box>
            </form>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formTitle}>Mot de passe</div>
              <Box display="flex" direction="column" padding={2} width="100%">
                <Box marginBottom={3}>
                  <TextField
                    id="password"
                    name="password"
                    placeholder="Mot de passe actuel"
                    type="password"
                    onChange={handleChange}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="password"
                    name="password"
                    placeholder="Nouveau mot de passe"
                    type="password"
                    onChange={handleChange}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="password"
                    name="password"
                    placeholder="Confirmer le mot de passe"
                    type="password"
                    onChange={handleChange}
                  />
                </Box>

                <Button text="Changer le mot de passe" color="red" />
              </Box>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
