import React, { useState, useEffect, useCallback } from "react";
import "@/app/globals.css";
import styles from "../app/pages.module.css";
import Navigation from "@/components/Navigation";
import CreatePost from "@/components/CreatePost";
import { useAppContext } from "@/context/AppContext";
import EventBoard from "@/components/EventBoard";
import SideMenu from "@/components/SideMenu";
import axios from "axios";
import { API_URL, BASIC_URL } from "@/configs/api";
import SuggestionBoard from "@/components/SuggestionBoard";
import allowedRoutes from "@/components/allowedRoutes";
import { useRouter } from "next/router";
import ExplorerPage from "@/components/ExplorerPage";
import EventPage from "@/components/EventPage";
import Link from "next/link";

const Home = () => {
  const router = useRouter();
  const [userImage, setUserImage] = useState("");
  const [userIdentity, setUserIdentity] = useState(null);
  const { token, setUser, setToken, setIsAuthenticated, eventPosts, userList } =
    useAppContext();
  const [activeTab, setActiveTab] = useState("explorer");

  const comparePostsByDate = (postA, postB) => {
    const dateA = new Date(postA.created_at);
    const dateB = new Date(postB.created_at);
    return dateB - dateA;
  };

  const sortedEvents = eventPosts.slice().sort(comparePostsByDate);

  const creatorSuggestions = userList.filter(
    (user) =>
      user?.is_creator === true && user?.username !== userIdentity?.username
  );

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
  }, [token]);

  useEffect(() => {
    const getUserImage = async () => {
      try {
        if (userIdentity && token) {
          const response = await axios.get(
            `${API_URL}/utilisateurs/get_image_url/${userIdentity?.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            const imageUrl = `${BASIC_URL}${data?.image_url}`;
            setUserImage(imageUrl);
          } else {
            // console.log(
            //   "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil."
            // );
          }
        }
      } catch (error) {
        console.log(
          "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil.",
          error
        );
      }
    };

    getUserImage();
  }, [userIdentity, token]);

  const renderTabContent = () => {
    if (activeTab === "explorer") {
      return <ExplorerPage />;
    } else if (activeTab === "event") {
      return <EventPage />;
    }
  };

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userPhoto={userImage}
          user={userIdentity}
        />

        <div className={styles.container}>
          <div className={styles.sideDiv}>
            <div className={styles.content} style={{ padding: "20px" }}>
              {sortedEvents.length > 0 && <EventBoard events={sortedEvents} />}
            </div>
          </div>
          <div className={styles.centerDiv}>
            <div className={styles.scrollWrapper}>
              <div className={styles.content}>
                <div className={styles.create}>
                  <CreatePost userPhoto={userImage} />
                </div>

                {renderTabContent()}
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

              <div
                style={{
                  fontSize: "12px",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                Exclusivity © 2023. Tout droit réservé
                <br />
                <Link
                  href="/conditions_d_utilisation"
                  style={{ textDecoration: "underline" }}
                >
                  Politique de confidentialité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
