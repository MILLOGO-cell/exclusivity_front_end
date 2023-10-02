import React, { useEffect, useState } from "react";
import { Button, Box, Text, Flex, IconButton, Modal } from "gestalt";
import Navbar from "@/components/Navbar";
import "../app/globals.css";
import Post from "@/components/Post";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import axios from "axios";
import { POSTS_REQUEST } from "@/configs/api";
import formatMomentText from "@/utils/utils";
import styles from "../app/Index.module.css";
import CustomButton from "@/components/NickButton";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const imageWidth = isMobile ? 100 : 300;
  const imageHeight = isMobile ? 30 : 70;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleOpenLoginForm = () => {
    setShowLoginForm(true);
  };
  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };
  const handleOpenRegisterForm = () => {
    setShowRegisterForm(true);
  };
  const handleCloseRegisterForm = () => {
    setShowRegisterForm(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Appeler handleResize une fois pour initialiser la valeur initiale de windowWidth
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const modalStyle = {
    zIndex: 9999,
  };
  const handleScrollToPublications = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(POSTS_REQUEST);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }

      const publicPosts = response.data.filter((post) => post.is_public);

      const processedPosts = publicPosts.map((post) => {
        const commentData = post.comments;
        return {
          ...post,
        };
      });

      setPosts(processedPosts);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.indexPage}>
      <Navbar
        onLoginButtonClick={handleOpenLoginForm}
        onRegisterButtonClick={handleOpenRegisterForm}
      />
      <div className={styles.heroWrapper}>
        <div className={styles.intro}>
          <span>Inscrivez-vous pour suivre vos artistes préférés</span>
        </div>

        <div className={styles.callToActionWrapper}>
          <div className={styles.callToAction}>
            <button
              className={styles.connectButton}
              onClick={handleOpenRegisterForm}
            >
              Rejoignez-nous dès maintenant!
            </button>
          </div>
          {showRegisterForm && (
            <div style={modalStyle}>
              <div>
                <RegisterForm
                  handleCloseRegisterForm={handleCloseRegisterForm}
                  showCloseButton={true}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.hero}>
          <div className={styles.imageStyle}>
            <Image
              alt="Logo"
              src="/Smarty1.jpg"
              width={imageWidth}
              height={70}
              style={{ borderRadius: 20 }}
            />
          </div>
          <div className={styles.imageStyleBlock}>
            <Image
              alt="Logo"
              src="/Floby1.jpg"
              width={300}
              height={70}
              style={{ borderRadius: 20 }}
            />
          </div>

          <div className={styles.imageStyleBlock}>
            <Image
              alt="Logo"
              src="/Imilo2.jpg"
              width={300}
              height={70}
              style={{ borderRadius: 20 }}
            />
          </div>

          <div className={styles.imageStyleBlock}>
            <Image
              alt="Logo"
              src="/kayawoto youtube.png"
              width={300}
              height={70}
              style={{ borderRadius: 20 }}
            />
          </div>

          <div className={styles.imageStyle}>
            <Image
              alt="Logo"
              src="/TANY.jpg"
              width={300}
              height={70}
              style={{ borderRadius: 20 }}
            />
          </div>
        </div>
      </div>
      <div className={styles.posts}>
        <div
          className={styles.customButton}
          onClick={handleScrollToPublications}
        >
          <button>
            <FontAwesomeIcon
              icon={faChevronCircleDown}
              style={{
                color: "red",
                backgroundColor: "white",
                borderRadius: "25px",
              }}
              size="3x"
            />
          </button>
        </div>
        {posts.map((post) => (
          <Post
            key={post.id}
            userPhoto={post?.author_get?.image || "/user1.png"}
            username={post?.author_get.username}
            timestamp={formatMomentText(new Date(post?.created_at))}
            content={post.content}
            mediaUrl={post.media}
            mediaType={"image"}
          />
        ))}
      </div>
      <div className={styles.bottomPage}>
        <div className={styles.bottomText}>
          <span>Abonnez-vous pour accéder à plus de contenus.</span>
        </div>
        <div className={styles.bottomSubscription}>
          <div className={styles.modalContent}>
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
              <div className={styles.response}>
                {responseMessage && (
                  <span align="center" color="error">
                    {responseMessage}
                  </span>
                )}
              </div>
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
                <Link href="/conditions_d_utilisation">
                  <span style={{ color: "blue", textDecoration: "underline" }}>
                    J&apos;accepte les conditions d&apos;utilisation
                  </span>
                </Link>
              </div>
              <div className={styles.button}>
                <CustomButton
                  text={loading ? "Chargement..." : "M'inscrire"}
                  buttonColor="red"
                  type="submit"
                  rounded
                  fullWidth={true}
                  onClick={handleSubmit}
                />
              </div>
              <span style={{ marginTop: 12 }}>
                Déjà membre ?{" "}
                <button style={{ color: "blue" }} onClick={handleOpenLoginForm}>
                  Se connecter
                </button>
              </span>
              {errorMessage && (
                <div className={styles.message}>
                  {" "}
                  <span>{errorMessage}</span>{" "}
                </div>
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
                    Content de vous compter parmis nous! Veuillez consulter
                    votre boite mail pour activer votre compte.😊
                  </Text>
                </Box>
              )}
            </div>
          </div>
          {/* <div className={styles.createButton}>
            <CustomButton text={"M'inscrire"} />
          </div> */}
        </div>
        {/* <Box
            height="100%"
            padding={12}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            alignSelf="center"
          >
            <Box
              direction={windowWidth < 350 ? "row" : "column"}
              justifyContent={windowWidth < 350 ? "around" : "around"}
              display="flex"
              alignItems="center"
              lgDisplay="flex"
              lgDirection="row"
              paddingX={12}
            >
              <Box
                width={windowWidth < 600 ? 400 : 600}
                marginTop={12}
                paddingY={12}
                justifyContent="center"
              >
                <Flex>
                  <span
                    style={{
                      color: "white",
                      fontSize: getTextSize(),
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Abonnez-vous pour accéder à plus de contenus.
                  </span>
                </Flex>
              </Box>
              <Box
                color="default"
                paddingX={5}
                paddingY={5}
                rounding={8}
                minWidth={300}
              >
                <RegisterForm showCloseButton={false} />
                <Text align="center">
                  Déjà membre ?{" "}
                  <a
                    href="#"
                    className="link-style"
                    onClick={handleOpenLoginForm}
                  >
                    Se connecter
                  </a>
                </Text>
                <style jsx>{`
                  .link-style {
                    color: blue;
                    cursor: pointer;
                    text-decoration: underline;
                  }
                `}</style>
                {showLoginForm && (
                  <div style={modalStyle}>
                    <Modal
                      accessibilityCloseLabel="Fermer"
                      accessibilityModalLabel="Formulaire de connexion"
                      onDismiss={handleCloseLoginForm}
                      size={350}
                    >
                      <Box padding={4}>
                        <LoginForm
                          handleCloseLoginForm={handleCloseLoginForm}
                        />
                      </Box>
                    </Modal>
                  </div>
                )}
              </Box>
            </Box>
          </Box> */}
      </div>
      {showLoginForm && (
        <div className={styles.modalStyle}>
          <LoginForm handleCloseLoginForm={handleCloseLoginForm} />
        </div>
      )}
      {showRegisterForm && (
        <div className={styles.modalStyle}>
          <div>
            <RegisterForm
              handleCloseRegisterForm={handleCloseRegisterForm}
              showCloseButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
