import React from "react";
import styles from "../app/ProfilePage.module.css";
import IconButton from "@/components/IconButton";
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

const ProfilePage = () => {
  const handleSubmit = () => {};
  const handleChange = () => {};
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // width: "100vh",
      }}
    >
      <Box>
        <Navigation />
      </Box>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
          // backgroundColor: "white",
          // height: "100%",
          flexDirection: "column",
          // width: "90%",
          marginTop: "50px",
          minHeight: "100vh",
          // border: "1px solid black",s
        }}
      >
        <h1 className={styles.pageTitle}>Mon profil</h1>
        <div className={styles.profileContainer}>
          <div className={styles.profileInfo}>
            <div className={styles.profilePhotoContainer}>
              <div className={styles.profileBox}>
                {/* <h1 className={styles.pageTitle2}>Mon profil</h1> */}
                <div className={styles.photoTitle}>Photo de profil</div>
                <img
                  src="../user.png"
                  alt="Photo de profil"
                  className={styles.profilePhoto}
                />
                <div className={styles.buttonsContainer}>
                  <Button text="Changer de profil" color="gray" />
                  <GestaltIconButton
                    icon="trash-can"
                    size="md"
                    iconColor="red"
                  />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formTitle}>Informations personnelles</div>
              <Box display="flex" direction="column" padding={2} Width="100%">
                <Box marginBottom={3}>
                  <TextField
                    id="username"
                    name="username"
                    placeholder="Nom d'utilisateur"
                    onChange={handleChange}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="nom"
                    name="nom"
                    placeholder="Nom"
                    onChange={handleChange}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="prenom"
                    name="prenom"
                    placeholder="Prénom"
                    onChange={handleChange}
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    onChange={handleChange}
                    size="lg"
                  />
                </Box>
                <Box marginBottom={3}>
                  <TextField
                    id="telephone"
                    name="telephone"
                    placeholder="Téléphone"
                    onChange={handleChange}
                  />
                </Box>
                <Button text="Enregistrer" color="gray" />
              </Box>
            </form>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.formTitle}>Mot de passe</div>
              <Box display="flex" direction="column" padding={2} Width="100%">
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
