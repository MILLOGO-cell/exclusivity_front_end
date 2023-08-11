import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Text, IconButton } from "gestalt";
import Link from "next/link";
import axios from "axios";
import { LOGIN_URL } from "../configs/api";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";

const LoginForm = ({ handleCloseLoginForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    setUser,
    setToken,
    user,
    token,
    setIsAuthenticated,
    isAuthenticated,
  } = useAppContext();
  const router = useRouter();

  const handleSubmit = async () => {
    setResponseMessage("");
    if (!username || !password) {
      setResponseMessage("Veuillez remplir tous les champs du formulaire");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        setToken(response.data.access);
        setIsAuthenticated(true);
        // Stocker les données dans le localStorage après la connexion réussie
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("isAuthenticated", true);

        // Rediriger vers la page "Explorer" ici si nécessaire
        router.push("/explorer");
      } else {
        console.log("Statut de réponse inattendu:", response.status);
        // Traiter l'erreur ici si nécessaire
      }
    } catch (error) {
      console.error("Erreur de connexion:", error?.response?.data?.error);
      setResponseMessage(error?.response?.data?.error);
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
            id="username"
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={({ value }) => setUsername(value)}
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
          <Button
            text={loading ? "Chargement..." : "Se connecter"}
            color="red"
            type="button"
            fullWidth
            disabled={loading}
            onClick={handleSubmit}
          />
        </Box>
        {responseMessage && (
          <Text align="center" color="error">
            {responseMessage}
          </Text>
        )}
        <Text align="center">
          {" "}
          <Link href="/reset_password_request">
            <Text as="a" inline color="link" weight="bold">
              😞 J&apos;ai oublié mon mot de passe
            </Text>
          </Link>
        </Text>
      </form>
    </Box>
  );
};

export default LoginForm;
