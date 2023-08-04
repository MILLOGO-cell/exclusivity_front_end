import React, { useState } from "react";
import { Box, Button, TextField, Text, IconButton } from "gestalt";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { REGISTER_URL } from "@/configs/api";
import axios from "axios";

const RegisterForm = ({ handleCloseRegisterForm, showCloseButton }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!username || !email || !password || !confirmPassword) {
      console.error("Veuillez remplir tous les champs du formulaire");
      setErrorMessage("Veuillez remplir tous les champs du formulaire");
      return;
    }
    if (password !== confirmPassword) {
      // console.error("Les mots de passe ne correspondent pas");
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      // console.error("Le mot de passe doit contenir au moins 8 caractères");
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(REGISTER_URL, {
        username: username,
        email: email,
        password: password,
      });

      if (response.status === 201) {
        setShowSuccessMessage(true);
      } else {
        console.error("Erreur lors de la création du compte");
        setErrorMessage("Erreur lors de la création du compte");
      }
    } catch (error) {
      // Gérer les erreurs d'Axios ou autres erreurs liées à la requête
      if (error.response) {
        // Le serveur a répondu avec un code d'état différent de 2xx
        if (error.response.status === 400) {
          if (error.response.data.email) {
            // Afficher le message d'erreur lié au champ "email" renvoyé par le backend
            setErrorMessage(error.response.data.email[0]);
          } else {
            // Afficher le message d'erreur général renvoyé par le backend
            setErrorMessage(error.response.data.message);
          }
        } else {
          console.error("Erreur de serveur :", error.response.data);
        }
      } else if (error.request) {
        // La requête a été faite mais il n'y a pas de réponse du serveur
        console.error("Pas de réponse du serveur :", error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Erreur de configuration de la requête :", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    position: "relative",
    zIndex: 9999, // Valeur de zIndex de votre choix
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    display: showCloseButton ? "block" : "none",
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} style={formStyle}>
        {showCloseButton && (
          <Box height={20} marginBottom={12}>
            <div style={closeButtonStyle}>
              <IconButton
                icon="cancel"
                accessibilityLabel="Fermer"
                onClick={handleCloseRegisterForm}
              />
            </div>
          </Box>
        )}
        <Text align="center" weight="bold" size="500">
          Créer un compte
        </Text>
        <Text align="center" weight="bold">
          Veuillez remplir les champs ci-dessous
        </Text>

        <Box marginTop={4} marginBottom={3}>
          <TextField
            id="username"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={({ value }) => setUsername(value)}
          />
        </Box>
        <Box marginBottom={3}>
          <TextField
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={({ value }) => setEmail(value)}
          />
        </Box>
        <Box marginBottom={3}>
          <TextField
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={({ value }) => setPassword(value)}
          />
        </Box>
        <Box marginBottom={3}>
          <TextField
            id="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={({ value }) => setConfirmPassword(value)}
          />
        </Box>
        <Box marginBottom={2}>
          <Button
            text={loading ? "Chargement en cours..." : "S'inscrire"}
            color="red"
            fullWidth
            onClick={handleSubmit}
          />
        </Box>
        {/* <Text align="center">
          Déjà membre ?{" "}
          <a href="#" className="link-style" onClick={handleOpenLoginForm}>
            Se connecter
          </a>
        </Text> */}
        {errorMessage && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={3}
            width="100%"
            direction="column"
            justifyContent="center"
          >
            {" "}
            <Text align="center" color="error">
              {errorMessage}
            </Text>{" "}
          </Box>
        )}
        {showSuccessMessage && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={3}
            width="100%"
            direction="column"
            justifyContent="center"
          >
            <Text color="success" size="lg" weight="bold">
              🎉 Compte créé avec succès! 🎉
            </Text>
            <Text align="center" color="success" size="lg" weight="bold">
              Content de vous compter parmis nous! Veuillez consulter votre
              boite mail pour activer votre compte.😊
            </Text>
          </Box>
        )}
      </form>
    </Box>
  );
};

export default RegisterForm;
