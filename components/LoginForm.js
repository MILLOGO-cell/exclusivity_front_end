import React, { useState } from "react";
import { Box, Button, TextField, Text, IconButton } from "gestalt";
import Link from "next/link";

const LoginForm = ({ handleCloseLoginForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logique pour traiter la soumission du formulaire de connexion ici
    console.log("Soumission du formulaire de connexion");
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
              onClick={handleCloseLoginForm}
            />
          </div>
        </Box>
        <Text align="center" weight="bold" size="500">
          Bonjour
        </Text>
        <Text align="center" weight="bold">
          Veuillez saisir vos identifiants svp
        </Text>

        <Box marginTop={4} marginBottom={3}>
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
        <Box marginBottom={2}>
          <Button text="Se connecter" color="red" type="button" fullWidth />
        </Box>
        {/* <Text align="center">
          Déjà membre ?{" "}
          <Link href="#" passHref>
            <Text as="a" inline color="link" weight="bold">
              Se connecter
            </Text>
          </Link>
        </Text> */}
      </form>
    </Box>
  );
};

export default LoginForm;
