import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Text } from "gestalt";
import axios from "axios";
import { REQUEST_PASSWORD_RESET } from "@/configs/api";
import { useRouter } from "next/router";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [waitingTime, setWaitingTime] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    let interval;

    if (waitingTime > 0) {
      interval = setInterval(() => {
        setWaitingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true); // Enable the resend button when waiting time is over
    }

    return () => clearInterval(interval);
  }, [waitingTime]);
  const resetFormValues = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setEmailSent(false);
    setEmailConfirmed(false);
    setWaitingTime(0);
  };
  const handleResetPassword = async () => {
    resetFormValues();
    if (email.trim() === "") {
      // Check if email is empty or contains only whitespace characters
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(REQUEST_PASSWORD_RESET, {
        email: email,
      });

      if (response.status === 200) {
        setSuccessMessage(
          "Un e-mail de réinitialisation de mot de passe a été envoyé."
        );
        setEmailSent(true);
        // router.push("/change_password");
        setWaitingTime(60);
        setCanResend(false);
      } else {
        setErrorMessage("Erreur lors de la réinitialisation du mot de passe.");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmail = () => {
    setEmailConfirmed(true);
  };

  useEffect(() => {
    // If the email is sent successfully and confirmed, redirect after a delay
    if (emailSent && emailConfirmed) {
      const timer = setTimeout(() => {
        router.push("/change_password");
      }, 3000); // Redirect after 3 seconds (adjust the time as needed)

      return () => clearTimeout(timer);
    }
  }, [emailSent, emailConfirmed]);
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box
        smFlexDirection="column"
        smMargin="auto"
        flexGrow={1}
        smMaxWidth="500px"
        padding={4}
      >
        <Text align="center" weight="bold" size="600">
          Réinitialiser le mot de passe
        </Text>
        <Box marginTop={12}>
          <TextField
            id="email"
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={({ value }) => setEmail(value)}
          />
        </Box>
        <Box marginTop={3}>
          <Button
            text={loading ? "Envoi en cours..." : "Envoyer"}
            color="red"
            fullWidth
            onClick={handleResetPassword}
          />
        </Box>
        {errorMessage && (
          <Box marginTop={3}>
            <Text align="center" color="error">
              {errorMessage}
            </Text>
          </Box>
        )}
        {successMessage && !emailConfirmed && (
          <Box marginTop={3}>
            <Text align="center" color="success">
              {successMessage}
            </Text>
            <Box marginTop={2}>
              <Button
                text="J'ai reçu l'e-mail"
                color="blue"
                fullWidth
                onClick={handleConfirmEmail}
              />
            </Box>
          </Box>
        )}
        {waitingTime > 0 && (
          <Box marginTop={3}>
            <Text align="center">
              Veuillez patienter {waitingTime} seconde(s) avant de pouvoir
              renvoyer un nouveau code.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
