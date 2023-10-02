import React, { useState } from "react";
import axios from "axios";
import { LOGIN_URL } from "../configs/api";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import styles from "../app/Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./NickButton";
import Link from "next/link";

const LoginForm = ({ handleCloseLoginForm }) => {
  const [login_identifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { setUser, setToken, setIsAuthenticated } = useAppContext();
  const router = useRouter();

  const handleSubmit = async () => {
    setResponseMessage("");
    if (!login_identifier || !password) {
      setResponseMessage("Veuillez remplir tous les champs du formulaire!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(LOGIN_URL, {
        login_identifier: login_identifier,
        password: password,
      });

      if (response.status === 200) {
        setUser(response.data.user);
        setToken(response.data.access);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("isAuthenticated", true);
        router.push("/explorer");
      } else {
        setResponseMessage(`Statut de réponse inattendu: ${response.status}`);
      }
    } catch (error) {
      setResponseMessage(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleCloseLoginForm}>
          <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />
        </button>

        <p className={styles.modalTitle}>Bonjour</p>
        <p className={styles.modalSubtitle}>
          Veuillez saisir vos identifiants svp
        </p>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Email ou nom d'utilisateur"
            value={login_identifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            className={styles.input}
          />
          <div className={styles.passwordInput}>
            <div className={styles.inputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />

              <button
                className={styles.passwordToggle}
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  color="gray"
                />
              </button>
            </div>
          </div>

          <div className={styles.link}>
            <Link href="/reset_password_request">
              <span>😞 J&apos;ai oublié mon mot de passe</span>
            </Link>
          </div>
          <div className={styles.button}>
            <CustomButton
              text={loading ? "Chargement..." : "Se connecter"}
              buttonColor="red"
              type="submit"
              rounded
              fullWidth={true}
              onClick={handleSubmit}
            />
          </div>
          <div className={styles.response}>
            {responseMessage && (
              <span align="center" color="error">
                {responseMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
