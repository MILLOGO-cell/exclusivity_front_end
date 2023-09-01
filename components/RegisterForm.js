import React, { useState } from "react";
import { Box, Button, TextField, Text, IconButton, Checkbox } from "gestalt";
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
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (!username || !email || !password || !confirmPassword) {
      console.error("Veuillez remplir tous les champs du formulaire");
      setErrorMessage("Veuillez remplir tous les champs du formulaire");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (!isChecked) {
      setErrorMessage("Veuillez accepeter les conditions d'utilisation!");
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
        setErrorMessage("Erreur lors de la création du compte");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.email) {
            setErrorMessage(error.response.data.email[0]);
          } else {
            setErrorMessage(error.response.data.message);
          }
        } else {
          setResponseMessage(`Erreur de serveur : ${error.response.data}`);
        }
      } else if (error.request) {
        setResponseMessage(`Pas de réponse du serveur : ${error.request}`);
      } else {
        setResponseMessage(
          `Erreur de configuration de la requête : ${error.message}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    position: "relative",
    zIndex: 9999,
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
        <div
          style={{
            margin: 15,
          }}
        >
          <div
            style={{
              margin: 5,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                marginRight: 5,
              }}
            >
              <label style={{ gap: 2 }}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
            J&apos;accepte les conditions d&apos;utilisation
          </div>
        </div>
        <Box marginBottom={2}>
          <Button
            text={loading ? "Chargement en cours..." : "S'inscrire"}
            color="red"
            fullWidth
            onClick={handleSubmit}
          />
        </Box>
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
