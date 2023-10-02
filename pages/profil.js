import React, { useState, useEffect } from "react";
import styles from "../app/ProfilePage.module.css";
import CustomButton from "@/components/NickButton";
import {
  Box,
  Button,
  IconButton as GestaltIconButton,
  TextField,
} from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrash,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
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
import Tabs from "@/components/Tabs";

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
  const [activeTab, setActiveTab] = useState("profil");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
    width: "150px",
    height: "150px",
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  function PublicationsTab() {
    return (
      <div
        style={{
          marginTop: "150px",
          color: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {" "}
        😞 oups! contenu indisponible ...
      </div>
    );
  }

  function ProfilTab() {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileInfo}>
          <div className={styles.profileBox}>
            <div className={styles.photoTitle}>
              <span>Photo de profil</span>
            </div>
            <label htmlFor="photoInput" className={styles.profilePhotoLabel}>
              <div className={styles.profilePhotoContainer}>
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
                <div className={styles.photoOverlay}>
                  <FontAwesomeIcon
                    icon={faCamera}
                    className={styles.cameraIcon}
                  />
                </div>
              </div>
            </label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <div className={styles.buttonsContainer}>
              <CustomButton
                text={loading ? "chargement ..." : "Changer de profil"}
                buttonColor="white"
                onClick={handleUploadPhoto}
                disabled={!selectedPhoto}
                rounded
              />
              <button onClick={handleRemovePhoto}>
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{
                    color: "red",
                    backgroundColor: "white",
                    borderRadius: "25px",
                  }}
                />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formTitle}>Informations personnelles</div>
            <div className={styles.form}>
              <div className={styles.inputDiv}>
                <input
                  id="username"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={({ value }) => setUsername(value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  id="nom"
                  name="nom"
                  placeholder="Nom"
                  value={last_name}
                  onChange={({ value }) => setLastName(value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  id="prenom"
                  name="prenom"
                  placeholder="Prénom"
                  value={first_name}
                  onChange={({ value }) => setFirstName(value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  id="email"
                  name="email"
                  placeholder={email}
                  type="email"
                  value={email}
                  onChange={({ value }) => setEmail(value)}
                  size="lg"
                  disabled
                  className={styles.inputDisabled}
                />
              </div>

              <div className={styles.inputDiv}>
                <input
                  id="telephone"
                  name="telephone"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={({ value }) => setTelephone(value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputDiv}>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder={bio ? bio : "Bio"}
                  type="text"
                  value={bio}
                  onChange={({ value }) => setBio(value)}
                  className={styles.textInput}
                />
              </div>
              <CustomButton
                text={isLoading ? "Chargement en cours..." : "Enregistrer"}
                buttonColor="blue"
                type="submit"
                rounded
              />
            </div>
          </form>
        </div>
      </div>
    );
  }

  function AboutTab() {
    return (
      <div
        style={{
          marginTop: "150px",
          color: "red",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {" "}
        😞 oups! contenu indisponible ...
      </div>
    );
  }

  function SubscriptionTab() {
    return <div>Contenu abonnement</div>;
  }

  function ConfidentialTab() {
    return (
      <div style={{ marginTop: "50px" }}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formTitle}>Changement de mot de passe</div>
          <p style={{ color: "red" }}>
            Nous vous rappelons l&apos;importance d&apos;utiliser un mot de
            passe fort, d&apos;au moins 8 caractères, pour garantir la sécurité
            de votre compte.
          </p>
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
    );
  }
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
      <div className={styles.pageTitle}>
        <h1>Mon compte</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "publications" && <PublicationsTab />}
        {activeTab === "profil" && <ProfilTab />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "abonnement" && <SubscriptionTab />}
        {activeTab === "confidentialite" && <ConfidentialTab />}
      </div>
    </div>
  );
};

export default ProfilePage;
