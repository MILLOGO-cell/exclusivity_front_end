import React, { useState } from "react";
import { Box, Button, TextField, Text } from "gestalt";
import { useRouter } from "next/router";
import axios from "axios";
import { RESET_PASSWORD_URL } from "@/configs/api";
import "@/app/globals.css";

const ChangePasswordPage = () => {
  // Le reste du code reste inchangé
  const [loading, setLoading] = useState(false);
  const [new_password1, setNew_password1] = useState("");
  const [new_password2, setNew_password2] = useState("");
  const [verification_code, setVerification_code] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [successMessage, setsuccessMessage] = useState("");

  const handleChangePassword = async () => {
    setLoading(true);
    seterrorMessage("");
    setsuccessMessage("");
    try {
      // Envoyer la requête POST avec les données du formulaire
      const response = await axios.post(RESET_PASSWORD_URL, {
        verification_code,
        new_password1,
        new_password2,
      });

      // Vérifier la réponse du serveur
      if (response.status === 200) {
        // Afficher le message de succès
        setsuccessMessage(response.data.message);
        setNew_password1("");
        setNew_password2("");
        setVerification_code("");
      } else {
        // Afficher le message d'erreur du serveur
        seterrorMessage(response.data.message);
      }
    } catch (error) {
      // En cas d'erreur lors de l'envoi de la requête
      seterrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }

    setLoading(false);
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box maxWidth={800} padding={4}>
        <Text align="center" weight="bold" size="600">
          Changer le mot de passe
        </Text>
        <Box marginTop={3}>
          <TextField
            id="code"
            type="text"
            placeholder="Code de vérification"
            value={verification_code}
            onChange={({ value }) => setVerification_code(value)}
            size="lg"
          />
        </Box>
        <Box marginTop={3}>
          <TextField
            id="password"
            type="password"
            placeholder="Nouveau mot de passe"
            value={new_password1}
            onChange={({ value }) => setNew_password1(value)}
            size="lg"
          />
        </Box>
        <Box marginTop={3}>
          <TextField
            id="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
            value={new_password2}
            onChange={({ value }) => setNew_password2(value)}
            size="lg"
          />
        </Box>
        <Box marginTop={3}>
          <Button
            text={
              loading ? "Chargement en cours..." : "Changer le mot de passe"
            }
            color="red"
            fullWidth
            onClick={handleChangePassword}
            size="lg"
          />
        </Box>
        {errorMessage && (
          <Box marginTop={3}>
            <Text align="center" color="error">
              {errorMessage}
            </Text>
          </Box>
        )}
        {successMessage && (
          <Box marginTop={3}>
            <Text align="center" color="success">
              {successMessage}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;
