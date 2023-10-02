import React, { useState } from "react";
import { REGISTER_URL } from "@/configs/api";
import axios from "axios";
import styles from "../app/Register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./NickButton";
import Link from "next/link";

const RegisterForm = ({ handleCloseRegisterForm, showCloseButton }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setShowSuccessMessage(false);
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Veuillez remplir tous les champs du formulaire!");
      return;
    }
    if (username.length < 3) {
      setErrorMessage(
        "Le nom d'utilisateur doit contenir au moins 6 caractères"
      );
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
      setErrorMessage("Veuillez accepter les conditions d'utilisation!");
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
        setErrorMessage("");
        setShowSuccessMessage(true);
      } else {
        setErrorMessage("Erreur lors de la création du compte");
        setShowSuccessMessage(false);
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
          setErrorMessage(`Erreur de serveur : ${error.response.data}`);
        }
      } else if (error.request) {
        setErrorMessage(`Pas de réponse du serveur : ${error.request}`);
      } else {
        setErrorMessage(
          `Erreur de configuration de la requête : ${error.message}`
        );
      }
      setShowSuccessMessage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={handleCloseRegisterForm}
        >
          <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />
        </button>
        <p className={styles.modalTitle}>Création de compte</p>
        <p className={styles.modalSubtitle}>
          Veuillez remplir les champs ci-dessous
        </p>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
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

            <div className={styles.passwordInput}>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmer mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>

          <div className={styles.linkDiv}>
            <label
              style={{
                marginRight: "5px",
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
            </label>
            {/* </div> */}
            <Link href="/conditions_d_utilisation">
              <span className={styles.link}>
                J&apos;accepte les conditions d&apos;utilisation
              </span>
            </Link>
          </div>
          <div className={styles.button}>
            <CustomButton
              text={loading ? "Chargement..." : "S'inscrire"}
              buttonColor="red"
              type="submit"
              rounded
              fullWidth={true}
              onClick={handleSubmit}
            />
          </div>
          <div className={styles.response}>
            {errorMessage && <span>{errorMessage}</span>}
            {showSuccessMessage && (
              <div className={styles.SuccessResponse}>
                <span>🎉 Compte créé avec succès! 🎉</span>
                <span align="center" color="success" size="lg" weight="bold">
                  Content de vous compter parmis nous! Veuillez consulter votre
                  boite mail pour activer votre compte.😊
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
