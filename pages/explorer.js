import React, { useState, useEffect, useCallback } from "react";
import "@/app/globals.css";
import {
  Box,
  Modal,
  Flex,
  Image,
  Sticky,
  CompositeZIndex,
  FixedZIndex,
  SideNavigation,
  Container,
  Text,
} from "gestalt";
import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import EventBoard from "@/components/EventBoard";
import SuggestionBoard from "@/components/SuggestionBoard";
import CreatePost from "@/components/CreatePost";
import PostView from "@/components/PostView";
import "intersection-observer";
import SubscriptionBoard from "@/components/SubcriptionBoard";
import { useAppContext } from "@/context/AppContext";
import { requireAuth } from "@/utils/middleware";
import axios from "axios";
import { POSTS_REQUEST, API_URL, BASIC_URL } from "@/configs/api";

const events = [
  {
    photo: "../logo.png",
    date: "01/08/2023",
    title: "Événement 1",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 2",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 3",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 4",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 5",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 6",
  },
];
const suggestions = [
  {
    id: 1,
    photo: "../logo.png",
    username: "utilisateur1",
  },
  {
    id: 2,
    photo: "../logo.png",
    username: "utilisateur2",
  },
  {
    id: 3,
    photo: "../logo.png",
    username: "utilisateur3",
  },
  {
    id: 4,
    photo: "../logo.png",
    username: "utilisateur4",
  },
  {
    id: 5,
    photo: "../logo.png",
    username: "utilisateur5",
  },
  // {
  //   photo: "lien_vers_photo2.jpg",
  //   username: "utilisateur2",
  // },
  // {
  //   photo: "lien_vers_photo2.jpg",
  //   username: "utilisateur2",
  // },
];

const Explorer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const BOX_ZINDEX = new FixedZIndex(100);
  const STICKY_ZINDEX = new CompositeZIndex([new FixedZIndex(1)]);
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    setIsAuthenticated,
  } = useAppContext();
  const [posts, setPosts] = useState([]); // State to store fetched posts
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDotsCount, setLoadingDotsCount] = useState(1);
  const [userIdentity, setUserIdentity] = useState(null);
  const [userImage, setUserImage] = useState("");
  const [reachedBottom, setReachedBottom] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const incrementLoadingDots = () => {
      setLoadingDotsCount((count) => (count === 3 ? 1 : count + 1));
    };

    const intervalId = setInterval(incrementLoadingDots, 500); // Incrémenter toutes les 500 millisecondes

    return () => {
      clearInterval(intervalId); // Nettoyer l'intervalle lorsque le composant est démonté
    };
  }, [isAuthenticated, token]);

  const handleScroll = useCallback(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setReachedBottom(true);
    } else {
      setReachedBottom(false);
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMorePosts(); // Charger de nouvelles données lorsque l'utilisateur atteint le bas de la page
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const loadMorePosts = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(POSTS_REQUEST, {
        headers,
        params: {
          page: currentPage + 1, // Charger la page suivante
        },
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }

      setPostsData((prevData) => [...prevData, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1); // Mettre à jour le numéro de page actuel
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    // Récupérer l'image de profil de l'utilisateur connecté
    const getUserImage = async () => {
      try {
        if (userIdentity && token) {
          const response = await axios.get(
            `${API_URL}/utilisateurs/get_image_url/${userIdentity.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            // Récupérer l'URL de l'image de profil de l'utilisateur connecté depuis la réponse
            const imageUrl = `${BASIC_URL}${data.image_url}`;
            // Mettre à jour l'état de l'URL de l'image de profil
            setUserImage(imageUrl);
          } else {
            console.log(
              "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil."
            );
          }
        }
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil.",
          error
        );
      }
    };

    // Appeler la fonction pour récupérer l'image de profil lorsque le composant est monté
    getUserImage();
  }, [userIdentity, token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSmallScreen(window.innerWidth < 600); // Mettre à jour la taille initiale

      function handleResize() {
        setIsSmallScreen(window.innerWidth < 600); // Mettre à jour la taille lors du redimensionnement de l'écran
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(POSTS_REQUEST, { headers });

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response from the server.");
        }
        setPosts(response.data);
        setIsLoading(false);
        console.log("post**", posts);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [isAuthenticated, token]);
  // const commentData = posts?.[0]?.comments;
  // console.log(commentData[0].id);
  const commentData = {
    id: 33,
    content: "Mon commentaire",
    created_at: "2023-08-04T09:59:40.587796Z",
    user: {
      id: 9,
      username: "Nico",
      telephone: "65047513",
      // Autres informations sur l'utilisateur
    },
    likes_count: 2,
    liked_users: ["Nico", "Nicolas"],
    replies: [
      {
        id: 34,
        content: "Réponse 1",
        created_at: "2023-08-04T10:00:00.000000Z",
        user: {
          id: 10,
          username: "Nicolas",
          telephone: "12345678",
          // Autres informations sur l'utilisateur
        },
        // Autres informations sur la réponse
      },
      // Autres réponses...
    ],
    // Autres informations sur le commentaire
  };

  const logoStyle = {
    width: "100%",
    height: "auto",
    alignSelf: "flex-start",
  };
  return (
    <Box
      dangerouslySetInlineStyle={{ __style: { isolation: "isolate" } }}
      tabIndex={0}
      height="auto"
      column={12}
    >
      <Sticky top={0} zIndex={STICKY_ZINDEX}>
        <Navigation />
      </Sticky>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        paddingY={0}
        paddingX={0}
      >
        <Box
          overflow="visible"
          paddingX={5}
          paddingY={5}
          smDisplay="none"
          mdDisplay="none"
          lgDisplay="flex"
          height="100%"
          width="40%"
          display={isSmallScreen ? "none" : "flex"}
        >
          <EventBoard events={events} />
        </Box>
        <Box overflow="scrollY" width="100%" maxHeight="150vh" tabIndex={0}>
          <Box
            paddingY={5}
            flex="grow"
            mdMarginEnd={2}
            mdMarginStart={2}
            smPaddingX={2}
            smMarginEnd={2}
            smMarginStart={12}
          >
            <CreatePost userPhoto={userImage} />
            <Box paddingY={0}>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "90vh",
                    fontSize: "36px",
                  }}
                >
                  Chargement
                  {".".repeat(loadingDotsCount)}
                </div>
              ) : (
                posts.map((post, index) => (
                  <Box key={index} paddingY={3}>
                    <PostView
                      postId={post.id}
                      profilePhoto={post.author_get.image}
                      eventTitle={post.eventTitle}
                      eventDate={post.eventDate}
                      eventTime={post.eventTime}
                      eventLocation={post.eventLocation}
                      username={post.author.username}
                      moment={new Date(post.created_at)}
                      postText={post.content}
                      media={post.media}
                      lastLikeUser={post.lastLikeUser}
                      likesCount={post.likes_count}
                      recentComment={post.recentComment}
                      commentData={commentData}
                      commentsCount={post.commentsCount}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>

        <Box
          tabIndex={-1}
          overflow="scroll"
          paddingX={5}
          width="40%"
          paddingY={5}
          smDisplay="none"
          mdDisplay="none"
          lgDisplay="flex"
          display={isSmallScreen ? "none" : "flex"}
        >
          <Flex direction="column" gap={3}>
            <SideMenu
              username={userIdentity?.username}
              fansCount={5000}
              userPhoto={userImage ? userImage : "../user1.png"}
            />
            <SuggestionBoard suggestions={suggestions} />
            {/* {subscriptions && (
              <SubscriptionBoard subscriptions={subscriptions} />
            )} */}
            <Box
              display="flex"
              direction="row"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              alignSelf="center"
            >
              <Box
                height={20}
                width={110}
                alignItems="center"
                justifyContent="center"
                alignContent="center"
                style={logoStyle}
                marginTop={1}
              >
                <Image
                  alt="Logo"
                  src="../logo.png"
                  fit="contain"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>
              <div>© 2023. Tout droit réservé</div>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
    // </Box>
  );
};

export default Explorer;
