import React, { useState } from "react";
import { Box, Button, TextField, Text, IconButton } from "gestalt";
import Link from "next/link";
import LoginForm from "./LoginForm";

const RegisterForm = ({ handleCloseRegisterForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique pour traiter la soumission du formulaire d'inscription ici
    console.log("Soumission du formulaire d'inscription");
  };

  const formStyle = {
    position: "relative",
    zIndex: 9999, // Valeur de zIndex de votre choix
  };

  const closeButtonStyle = {
    position: "absolute",
    top: 0,
    right: 0,
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} style={formStyle}>
        <Box height={20} marginBottom={12}>
          <div style={closeButtonStyle}>
            <IconButton
              icon="cancel"
              accessibilityLabel="Fermer"
              onClick={handleCloseRegisterForm}
            />
          </div>
        </Box>
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
          <Button text="S'inscrire" color="red" type="button" fullWidth />
        </Box>
        {/* <Text align="center">
          Déjà membre ?{" "}
          <a href="#" className="link-style" onClick={handleOpenLoginForm}>
            Se connecter
          </a>
        </Text> */}
      </form>
    </Box>
  );
};

export default RegisterForm;
