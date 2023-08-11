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
import SuggestionBoard from "@/components/SuggestionBoard";
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
    eventPosts,
    userList,
    setUserList,
  } = useAppContext();
  const [userImage, setUserImage] = useState("");
  const [updatePosts, setUpdatePosts] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [loadingDotsCount, setLoadingDotsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  });

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
          eventTitle={post.title}
          eventDate={post.date}
          eventTime={post.time}
          eventLocation={post.location}
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
    return dateB - dateA;
  };
  // Utilisez la fonction de comparaison pour trier les posts par date de création
  const sortedPosts = posts.slice().sort(comparePostsByDate);
  const sortedEvents = eventPosts.slice().sort(comparePostsByDate);

  // Filtrer les suggestions pour les utilisateurs ayant is_creator=True
  const creatorSuggestions = userList.filter(
    (user) =>
      user?.is_creator === true && user?.username !== userIdentity?.username
  );
  // console.log("****", sortedPosts);
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
      {/* <div
        style={{
          paddingLeft: "100px",
          paddingRight: "100px",
        }}
      > */}
      <Navigation />
      {/* </div> */}
      <div className={styles.container}>
        <div className={styles.sideDiv}>
          <div className={styles.content} style={{ padding: "20px" }}>
            <EventBoard events={sortedEvents} />
          </div>
        </div>
        <div className={styles.centerDiv}>
          {/* Utilisez une div supplémentaire pour masquer la barre de défilement */}
          <div className={styles.scrollWrapper}>
            <div className={styles.content}>
              <div className={styles.create}>
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
            <div style={{ paddingBottom: "20px" }}>
              <SideMenu
                username={userIdentity?.username}
                fansCount={userIdentity?.followers_count}
                userPhoto={userImage ? userImage : "../user1.png"}
              />
            </div>
            <div style={{ paddingBottom: "20px" }}>
              {userList?.length > 0 && creatorSuggestions.length > 0 && (
                <SuggestionBoard suggestions={creatorSuggestions} />
              )}
            </div>

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
