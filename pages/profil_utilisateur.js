import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Modal, Box, Button, Text } from "gestalt";
import IconButton from "@/components/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning, faAdd } from "@fortawesome/free-solid-svg-icons";
import "@/app/globals.css";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import styles from "../app/ProfilUser.module.css";
import SideMenu from "@/components/SideMenu";
import Navigation from "@/components/Navigation";
import axios from "axios";
import { API_URL, BASIC_URL } from "@/configs/api";
import { useAppContext } from "@/context/AppContext";
import allowedRoutes from "@/components/allowedRoutes";
import jwtDecode from "jwt-decode";
import { SUBSCRIBE_URL, UNSUBSCRIBE_URL, USER_DETAILS } from "@/configs/api";

const ProfileArtisteImages = ({}) => {
  const router = useRouter();
  const id = router.query?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const {
    token,
    isAuthenticated,
    setUser,
    setToken,
    setIsAuthenticated,
    userDetails,
    setUserDetails,
  } = useAppContext();
  const [userImage, setUserImage] = useState("");
  const [userProfilImage, setUserProfilImage] = useState("");
  const [userIdentity, setUserIdentity] = useState(null);
  const [userProfile, setuserProfile] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);

  const fetchMyDetails = async () => {
    try {
      const response = await axios.get(USER_DETAILS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        setUserDetails(data.user_details);
      } else {
        // console.log(
        //   "Erreur lors de la récupération des détails de l'utilisateur:",
        //   response.data
        // );
      }
    } catch (error) {
      // console.log(
      //   "Une erreur s'est produite lors de la récupération des détails de l'utilisateur:",
      //   error
      // );
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if ((id, token)) {
          const response = await axios.get(
            `${API_URL}/utilisateurs/users/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;

            setuserProfile(data);
          } else {
            console.log("Une erreur s'est produite");
          }
        }
      } catch (error) {
        // console.log(
        //   "Une erreur s'est produite lors de la récupération du profil.",
        //   error
        // );
      }
    };

    fetchUserDetails();
  }, [id, token, userIdentity]);

  const isUserFollowingCreator = (creatorId) => {
    if (userDetails && userDetails?.subscribed_creators) {
      return userDetails?.subscribed_creators.includes(creatorId);
    }
    return false;
  };
  const isUserSubscribed = isUserFollowingCreator(parseInt(id));

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
    try {
      const tokenData = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (tokenData.exp < currentTime) {
        // Token expiré
        // Afficher un message de toast et rediriger vers la page d'accueil
        // toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        router.push("/");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
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
            const imageUrl = `${BASIC_URL}${data.image_url}`;
            setUserProfilImage(imageUrl);
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
    const getUserImage = async () => {
      try {
        if (userProfile && token) {
          const response = await axios.get(
            `${API_URL}/utilisateurs/get_image_url/${userProfile?.id}/`,
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
  }, [userProfile, token]);

  const openModal = () => {
    if (isSubscribed) {
      setShowModal(true);
    } else {
    }
  };
  const formatFollowersCount = (followersCount) => {
    if (followersCount >= 1000000000) {
      return `${(followersCount / 1000000000).toFixed(1)}B`;
    } else if (followersCount >= 1000000) {
      return `${(followersCount / 1000000).toFixed(1)}M`;
    } else if (followersCount >= 1000) {
      return `${(followersCount / 1000).toFixed(1)}K`;
    } else {
      return `${followersCount}`;
    }
  };
  const handleFollow = (id) => {
    const isFollowing = isUserSubscribed;
    const action = isFollowing ? "unsubscribe" : "subscribe";

    const requestBody = {
      creator: id,
      subscriber: userIdentity?.id,
    };

    const apiUrl = action === "subscribe" ? SUBSCRIBE_URL : UNSUBSCRIBE_URL;

    axios
      .post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          fetchMyDetails();
        } else {
          throw new Error("Erreur lors de la requête");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'abonnement/désabonnement :", error);
      });
  };

  const [activeTab, setActiveTab] = useState("gallery");

  const formattedUsername = userProfile?.username
    .toLowerCase()
    .replace(/ /g, "_");

  const userPhotos = [
    { id: 1, url: "/Floby1.jpg" },
    { id: 2, url: "/Imilo2.jpg" },
    { id: 3, url: "/Smarty1.jpg" },
    { id: 4, url: "/TANY.jpg" },
    { id: 5, url: "/Smarty1.jpg" },
    { id: 6, url: "/FLob.png" },
    { id: 7, url: "/FLob.png" },
    { id: 8, url: "/Smarty1.jpg" },
    { id: 9, url: "/Smarty1.jpg" },
    { id: 10, url: "/TANY.jpg" },
    { id: 11, url: "/Imilo2.jpg" },
    { id: 12, url: "/Floby1.jpg" },
  ];
  const userInfo = {
    name: "",
    bio: `La biographie de ${userIdentity?.username} est temporairement indisponible et sera rétabli dans un bref délai. Veuillez nous excuser pour la gêne occasionnée.`,
  };

  const splitPhotosIntoPairs = (photos) => {
    const pairs = [];
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    for (let i = startIndex; i < endIndex && i < photos.length; i += 2) {
      pairs.push(photos.slice(i, i + 2));
    }
    return pairs;
  };

  const photoPairs = splitPhotosIntoPairs(userPhotos);
  return (
    <>
      <Navigation />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={styles.container}>
          <div className={`${styles.artistInfoContainer}`}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                direction: "column",
                justifyContent: "center",
              }}
            >
              <img
                src={userImage}
                alt={userIdentity?.username}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginRight: "15px",
                }}
                width={100}
                height={100}
              />
              <div className={styles.artistFollowersContainer}>
                <div>
                  <span className={styles.artistUsername}>
                    {userProfile?.username}
                  </span>
                </div>
                <div>
                  <span className={styles.artistLink}>
                    @{formattedUsername}
                  </span>
                  <span style={{ marginRight: "5px" }}>•</span>
                  <span className={styles.artistFollowers}>
                    {formatFollowersCount(userProfile?.followers_count)}{" "}
                    abonné(s)
                  </span>
                </div>
              </div>
            </div>
            <div className={`${styles.artistButtonContainer}`}>
              {userProfile?.is_creator && (
                <IconButton
                  icon={
                    <FontAwesomeIcon
                      icon={isUserSubscribed ? faWarning : faAdd}
                    />
                  }
                  label={isUserSubscribed ? "Se désabonner" : "S'abonner"}
                  buttonColor={isUserSubscribed ? "white" : "blue"}
                  textColor={isUserSubscribed ? "red" : "white"}
                  iconColor={isUserSubscribed ? "red" : "white"}
                  iconPosition="left"
                  borderColor={isUserSubscribed ? "red" : "blue"}
                  border
                  onClick={() => {
                    if (isUserSubscribed) {
                      setShowModal(true);
                    } else {
                      handleFollow(id);
                    }
                  }}
                />
              )}
            </div>
            {showModal && (
              <Modal
                accessibilityModalLabel="Confirmation de désabonnement"
                heading="Confirmation de désabonnement"
                onDismiss={() => setShowModal(false)}
                footer={
                  <Box display="flex" justifyContent="center">
                    <Box marginEnd={2}>
                      <Button
                        text="Confirmer"
                        inline
                        color="red"
                        onClick={() => {
                          handleFollow(id);
                          setShowModal(false);
                        }}
                      />
                    </Box>

                    <Button
                      text="Annuler"
                      inline
                      onClick={() => setShowModal(false)}
                      color="gray"
                    />
                  </Box>
                }
                size={450}
                role="alertdialog"
                headingLevel={2}
                footerType="sticky"
                preventScroll
              >
                <Box padding={2}>
                  <Text>
                    Cher utilisateur/trice, en vous désabonnant de ce compte,
                    vous n&apos;aurez plus accès aux différents contenus qui y
                    sont liés. Êtes-vous sûr(e) de vouloir continuer et vous
                    désabonner ?
                  </Text>
                </Box>
              </Modal>
            )}
          </div>

          <div className={styles.fetchContainer}>
            <div>
              <button
                style={{
                  marginRight: "10px",
                  backgroundColor:
                    activeTab === "gallery" ? "white" : "transparent",
                  color: activeTab === "gallery" ? "blue" : "black",
                  borderBottom:
                    activeTab === "gallery" ? "2px solid #ccc" : "white",
                  borderColor: activeTab === "gallery" ? "blue" : "black",
                  padding: "6px 5px",
                }}
                onClick={() => setActiveTab("gallery")}
              >
                Galerie
              </button>
              <button
                style={{
                  backgroundColor:
                    activeTab === "about" ? "white" : "transparent",
                  color: activeTab === "about" ? "blue" : "black",
                  borderBottom:
                    activeTab === "about" ? "2px solid #ccc" : "white",
                  borderColor: activeTab === "about" ? "blue" : "black",
                  padding: "6px 5px",
                }}
                onClick={() => setActiveTab("about")}
              >
                À propos
              </button>
            </div>
            {activeTab === "gallery" && (
              // <div className={`${styles.galleryContainer}`}>
              //   {photoPairs.map((pair, index) => (
              //     <>
              //       <div
              //         key={index}
              //         style={{
              //           display: "flex",
              //           marginBottom: "10px",
              //           marginTop: "2px",
              //         }}
              //       >
              //         {pair.map((photo) => (
              //           <img
              //             key={photo.id}
              //             src={photo.url}
              //             alt={`Photo ${photo.id}`}
              //             style={{
              //               width: "200px",
              //               height: "200px",
              //               marginRight: "10px",
              //             }}
              //           />
              //         ))}
              //       </div>
              //     </>
              //   ))}
              //   <div
              //     style={{
              //       display: "flex",
              //       justifyContent: "center",
              //       marginTop: "10px",
              //     }}
              //   >
              //     {currentPage > 1 && (
              //       <button onClick={() => setCurrentPage(currentPage - 1)}>
              //         Précédent
              //       </button>
              //     )}
              //     {userPhotos.length > currentPage * 6 && (
              //       <button onClick={() => setCurrentPage(currentPage + 1)}>
              //         Suivant
              //       </button>
              //     )}
              //   </div>
              // </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "red",
                }}
              >
                <p>
                  Le contenu est temporairement indisponible et sera rétabli
                  dans un bref délai. Veuillez nous excuser pour la gêne
                  occasionnée.
                </p>
              </div>
            )}
            {activeTab === "about" ? <About userInfo={userInfo} /> : null}
          </div>

          <div className={styles.sidemenu}>
            <SideMenu
              username={userIdentity?.username}
              fansCount={userIdentity?.followers_count}
              userPhoto={userProfilImage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileArtisteImages;
