import React, { useState, useEffect } from "react";
import "@/app/globals.css";
import styles from "../app/pages.module.css";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { API_URL, BASIC_URL } from "@/configs/api";
import PostView from "@/components/PostView";
import allowedRoutes from "@/components/allowedRoutes";
import { useRouter } from "next/router";

const EventPage = () => {
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    setIsAuthenticated,
    eventPosts,
  } = useAppContext();
  const [userImage, setUserImage] = useState("");
  const [userIdentity, setUserIdentity] = useState(null);
  const [loadingDotsCount, setLoadingDotsCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");

    setUser(JSON.parse(storedUser));
    setToken(storedToken);
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);

    setIsAuthenticated(storedIsAuthenticated);

    if (!storedIsAuthenticated && !allowedRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [setIsAuthenticated, setToken, setUser, setUserIdentity]);

  useEffect(() => {
    const incrementLoadingDots = () => {
      setLoadingDotsCount((count) => (count === 3 ? 1 : count + 1));
    };

    const intervalId = setInterval(incrementLoadingDots, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
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
            const imageUrl = `${BASIC_URL}${data.image_url}`;
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
    if (post && post.author_get && post.author_get.image && post.content) {
      return (
        <PostView
          postId={post.id}
          id={post.author_get?.id}
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
      return <div>Chargement...</div>;
    }
  };
  const comparePostsByDate = (postA, postB) => {
    const dateA = new Date(postA.created_at);
    const dateB = new Date(postB.created_at);
    return dateB - dateA;
  };
  const sortedPosts = eventPosts.slice().sort(comparePostsByDate);

  return (
    <div className={styles.container}>
      <div className={styles.centerDiv}>
        <div className={styles.scrollWrapper}>
          <div className={styles.content}>
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
    </div>
  );
};
export default EventPage;
