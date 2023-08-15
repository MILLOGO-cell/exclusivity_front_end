import React, { useState, useEffect, useCallback } from "react";
import "@/app/globals.css";
import styles from "../app/pages.module.css";
import Navigation from "@/components/Nav1";
import CreatePost from "@/components/CreatePost";
import { useAppContext } from "@/context/AppContext";
import EventBoard from "@/components/EventBoard";
import SideMenu from "@/components/SideMenu";
import axios from "axios";
import { API_URL, BASIC_URL } from "@/configs/api";
import PostView from "@/components/PostView";
import allowedRoutes from "@/components/allowedRoutes";
const Home = () => {
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    setIsAuthenticated,
    posts,
    isloading,
    fetchPosts,
  } = useAppContext();
  const [userImage, setUserImage] = useState("");
  const [updatePosts, setUpdatePosts] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [loadingDotsCount, setLoadingDotsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const events = [
    {
      photo: " ../event1.jpg",
      date: "01/12/2023",
      title: "Festival des glaces",
    },
    {
      photo: "../event2.jpg",
      date: "05/08/2023",
      title: "Festi-bière",
    },
    {
      photo: "../event3.jpg",
      date: "05/08/2023",
      title: "Mega show piscine",
    },
    {
      photo: "../event4.jpg",
      date: "05/08/2023",
      title: "Formation en art oratoire",
    },
    {
      photo: "../event5.png",
      date: "05/08/2023",
      title: "Panda Events",
    },
    {
      photo: "../event6.jpg",
      date: "05/08/2023",
      title: "School management",
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);

    // Mettre à jour le statut d'authentification dans le contexte
    setIsAuthenticated(storedIsAuthenticated);

    // Maintenant que le statut d'authentification est mis à jour dans le contexte,
    // vous pouvez exécuter la vérification de l'authentification dans votre middleware
    if (!storedIsAuthenticated && !allowedRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [token]);

  useEffect(() => {
    const incrementLoadingDots = () => {
      setLoadingDotsCount((count) => (count === 3 ? 1 : count + 1));
    };

    const intervalId = setInterval(incrementLoadingDots, 500); // Incrémenter toutes les 500 millisecondes

    return () => {
      clearInterval(intervalId); // Nettoyer l'intervalle lorsque le composant est démonté
    };
  }, [isAuthenticated, token]);

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

  const renderPostView = (post) => {
    // Vérifier si post est valide et contient toutes les propriétés nécessaires
    if (post && post.author_get && post.author_get.image && post.content) {
      return (
        <PostView
          postId={post.id}
          profilePhoto={post.author_get.image}
          eventTitle={post.eventTitle}
          eventDate={post.eventDate}
          eventTime={post.eventTime}
          eventLocation={post.eventLocation}
          username={post.author_get.username}
          moment={new Date(post.created_at)}
          postText={post.content}
          media={post.media}
          lastLikeUser={post.lastLikeUser}
          likesCount={post.likes_count}
          recentComment={post.recentComment}
          commentData={post.commentData}
          commentsCount={post.comments_count}
        />
      );
    } else {
      // Retourner un message ou un composant de chargement si certaines données sont manquantes
      return <div>Chargement...</div>;
    }
  };
  // Définissez une fonction de comparaison pour trier les posts par date de création
  const comparePostsByDate = (postA, postB) => {
    const dateA = new Date(postA.created_at);
    const dateB = new Date(postB.created_at);
    return dateB - dateA; // Triez en ordre décroissant (les posts les plus récents en premier)
  };

  // Utilisez la fonction de comparaison pour trier les posts par date de création
  const sortedPosts = posts.slice().sort(comparePostsByDate);

  // Créez un tableau pour stocker les couleurs des boîtes
  const colors = [
    "#ff5733",
    "#33ff57",
    "#5733ff",
    "#33ffaa",
    "#ffaa33" /* Ajoutez plus de couleurs ici */,
  ];

  // Fonction pour générer des nombres aléatoires entre min et max (inclus)
  const getRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Générez environ 50 boîtes avec des couleurs aléatoires et des tailles différentes
  const boxes = Array.from({ length: 50 }, (_, index) => {
    const size = 100; // Largeur et hauteur fixe des boîtes
    const color = colors[getRandomNumber(0, colors.length - 1)]; // Couleur aléatoire du tableau colors
    const boxStyle = {
      width: `${size}%`,
      height: `${size}px`,
      backgroundColor: color,
      marginBottom: "10px", // Espacement entre les boîtes
    };
    return <div key={index} className={styles.box} style={boxStyle}></div>;
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Navigation />
      <div className={styles.container}>
        <div className={styles.sideDiv}>
          <div className={styles.content} style={{ padding: "20px" }}>
            <EventBoard events={events} />
          </div>
        </div>
        <div className={styles.centerDiv}>
          {/* Utilisez une div supplémentaire pour masquer la barre de défilement */}
          <div className={styles.scrollWrapper}>
            <div className={styles.content}>
              <div
                style={{
                  padding: "12px",
                  width: "700px",
                }}
              >
                <CreatePost
                  userPhoto={userImage}
                  updatePosts={setUpdatePosts}
                />
              </div>
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
                sortedPosts.map((post, index) => (
                  <div key={index} style={{ paddingBottom: "20px" }}>
                    {renderPostView(post)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className={styles.sideDiv}>
          <div className={styles.content} style={{ padding: "20px" }}>
            <SideMenu
              username={userIdentity?.username}
              fansCount={5000}
              userPhoto={userImage ? userImage : "../user1.png"}
            />
            {/* <SuggestionBoard suggestions={suggestions} /> */}
            {/* {subscriptions && (
              <SubscriptionBoard subscriptions={subscriptions} />
            )} */}
            <div style={{ fontSize: "15px" }}>
              {" "}
              Exclusivity © 2023. Tout droit réservé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
