import React, { useEffect, useState } from "react";
import {
  PageHeader,
  Image,
  Button,
  Box,
  Text,
  Flex,
  IconButton,
  Modal,
} from "gestalt";
import Navbar from "@/components/Navbar";
import "../app/globals.css";
import Post from "@/components/Post";
import RegisterForm from "@/components/RegisterForm";
import LoginForm from "@/components/LoginForm";
import axios from "axios";
import { POSTS_REQUEST } from "@/configs/api";
import formatMomentText from "@/utils/utils";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    user,
    setUser,
    setToken,
    token,
    isAuthenticated,
    setIsAuthenticated,
    logout,
  } = useAppContext();

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

  // Fonction pour déterminer la taille et la hauteur de la boîte en fonction de la largeur de l'écran
  const getBoxSize = () => {
    if (windowWidth < 600) {
      return {
        width: "10%", // Largeur pour les écrans étroits
        height: 100, // Hauteur pour les écrans étroits
      };
    } else if (windowWidth < 1200) {
      return {
        width: "20%", // Largeur pour les écrans de taille moyenne
        height: 200, // Hauteur pour les écrans de taille moyenne
      };
    } else {
      return {
        width: "16.66%", // Largeur pour les écrans larges
        height: 350, // Hauteur pour les écrans larges
      };
    }
  };
  const getTextSize = () => {
    if (windowWidth < 600) {
      return "20px";
    } else if (windowWidth < 1200) {
      return "50px";
    } else {
      return "90px";
    }
  };
  const modalStyle = {
    zIndex: 9999, // Valeur de zIndex de votre choix
  };
  const boxSize = getBoxSize();
  const handleScrollToPublications = () => {
    window.scrollTo({
      top: window.innerHeight, // Définir ici la position à laquelle vous souhaitez que la page défile
      behavior: "smooth", // Ajoutez cette option pour un défilement en douceur
    });
  };
  const fetchPosts = async () => {
    try {
      // const headers = {
      //   Authorization: `Bearer ${token}`, // Assurez-vous d'avoir le token approprié ici
      // };
      const response = await axios.get(POSTS_REQUEST);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }

      // Filter posts where is_public is true
      const publicPosts = response.data.filter((post) => post.is_public);

      // Process each post in the response to extract comments data
      const processedPosts = publicPosts.map((post) => {
        // Extract comments data from the response for each post
        const commentData = post.comments;
        // Return an object that includes the original post data and the comments data
        return {
          ...post,
          // commentData: post.comments,
        };
      });

      setPosts(processedPosts);
      setIsLoading(false);
      // if (processedPosts.length > 0) {
      //   setCommentData(processedPosts[0].commentData);
      // }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Appel de la fonction fetchPosts au chargement de la page
  }, []);

  return (
    <Box
      // borderStyle="sm"
      // width={windowWidth < 768 ? "100%" : "1024px"}
      justifyContent="center"
    >
      <Navbar />
      <Box
        display="flex"
        direction="column"
        alignItems="center"
        marginTop={5}
        marginBottom={10}
        width={windowWidth > 768 ? "700px" : "50%"}
        justifyContent="center"
        alignContent="center"
        alignSelf="center"
        margin="auto"
      >
        <Text
          align="center"
          size={windowWidth > 768 ? "600" : "400"}
          weight="bold"
        >
          Inscrivez-vous pour suivre vos artistes préférés
        </Text>
      </Box>
      <Box
        // borderStyle="sm"
        width="100%"
        marginTop={12}
        height={"auto"}
        justifyContent="center"
      >
        <Box display="flex" justifyContent="center" direction="column">
          <Box
            // width={300}
            height={70}
            alignSelf="center"
            justifyContent="center"
            alignContent="center"
          >
            <Button
              text="Rejoignez-nous dès maintenant!"
              color="red"
              size="lg"
              onClick={handleOpenRegisterForm}
            />
          </Box>
          {showRegisterForm && (
            <div style={modalStyle}>
              <Modal
                accessibilityCloseLabel="Fermer"
                accessibilityModalLabel="Formulaire d'inscription"
                onDismiss={handleCloseRegisterForm}
                size={400}
              >
                <Box padding={4}>
                  <RegisterForm
                    handleCloseRegisterForm={handleCloseRegisterForm}
                    showCloseButton={true}
                  />
                </Box>
              </Modal>
            </div>
          )}
          <Box>
            <Box
              display="flex"
              direction="row"
              justifyContent="center"
              alignSelf="center"
              marginBottom={22}

              // borderStyle="sm"
            >
              <Box
                display="block"
                borderStyle="sm"
                // marginTop={12}
                marginTop={windowWidth < 600 ? 0 : -12}
                mdMarginTop={-12}
                smMarginTop={-10}
                width={boxSize.width}
                height={boxSize.height}
                rounding={8}
                minWidth={62}
                maxWidth="100%"
                marginEnd={2}
                marginRight={windowWidth < 600 ? 1 : 2}
                marginStart={windowWidth < 600 ? 2 : 12}
                overflow="hidden"
              >
                <Image
                  alt="Logo"
                  src="../Smarty1.jpg"
                  fit="cover"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>
              <Box
                display="block"
                borderStyle="sm"
                marginTop={12}
                mdMarginTop={6}
                smMarginTop={3}
                width={boxSize.width}
                height={boxSize.height}
                rounding={8}
                minWidth={62}
                maxWidth="100%"
                marginEnd={2}
                overflow="hidden"
                // marginRight={windowWidth < 600 ? 1 : 2}
                // marginStart={windowWidth < 600 ? 0 : 12}
              >
                <Image
                  alt="Logo"
                  src="../Floby1.jpg"
                  fit="cover"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>

              <Box
                display="block"
                borderStyle="sm"
                marginTop={12}
                mdMarginTop={6}
                smMarginTop={3}
                width={boxSize.width}
                height={boxSize.height}
                rounding={8}
                minWidth={62}
                maxWidth="100%"
                marginEnd={2}
                overflow="hidden"
                // marginRight={windowWidth < 600 ? 1 : 2}
                // marginStart={windowWidth < 600 ? 0 : 12}
              >
                <Image
                  alt="Logo"
                  src="../Imilo2.jpg"
                  fit="cover"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>

              <Box
                display="block"
                borderStyle="sm"
                marginTop={12}
                mdMarginTop={6}
                smMarginTop={3}
                width={boxSize.width}
                height={boxSize.height}
                rounding={8}
                minWidth={62}
                maxWidth="100%"
                marginEnd={2}
                overflow="hidden"
                // marginRight={windowWidth < 600 ? 1 : 2}
                // marginStart={windowWidth < 600 ? 0 : 12}
              >
                <Image
                  alt="Logo"
                  src="../kayawoto youtube.png"
                  fit="cover"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>

              <Box
                display="block"
                borderStyle="sm"
                // marginTop={12}
                mdMarginTop={-12}
                smMarginTop={-10}
                marginTop={windowWidth < 600 ? 0 : -12}
                width={boxSize.width}
                height={boxSize.height}
                rounding={8}
                minWidth={62}
                maxWidth="100%"
                marginEnd={2}
                overflow="hidden"
                // marginRight={windowWidth < 600 ? 1 : 2}
                // marginStart={windowWidth < 600 ? 0 : 12}
              >
                <Image
                  alt="Logo"
                  src="../TANY.jpg"
                  fit="cover"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        width="100%"
        height={windowWidth < 350 ? 80 : "90%"}
        color="warningWeak"
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        alignSelf="center"
      >
        <Box paddingY={2}>
          <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignSelf="center"
            alignContent="center"
            alignItems="center"
          >
            <IconButton
              accessibilityLabel="Scroll"
              icon="arrow-down"
              size="md"
              bgColor="red"
              tooltip={{ text: "Voir les dernières publications" }}
              onClick={handleScrollToPublications}
            />
          </Flex>
        </Box>
        {posts.map((post) => (
          <Post
            key={post.id}
            username={post?.author_get.username}
            timestamp={formatMomentText(new Date(post?.created_at))}
            content={post.content}
            mediaUrl={post.media}
            mediaType={"image"}
          />
        ))}
        <Box
          borderStyle="sm"
          width="100%"
          height={windowWidth < 350 ? 100 : 900}
          justifyContent="center"
        >
          <Image
            alt="Logo"
            src="../Background.png"
            fit="cover"
            naturalHeight={751}
            naturalWidth={564}
          >
            <Box
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
                <Box color="default" paddingX={5} paddingY={5} rounding={8}>
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
            </Box>
          </Image>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
