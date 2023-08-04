import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Modal, Box, Button, Text } from "gestalt";
import IconButton from "@/components/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import "@/app/globals.css";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import styles from "../app/ProfilUser.module.css";
import SideMenu from "@/components/SideMenu";
import Navigation from "@/components/Navigation";

const ProfileArtisteImages = ({}) => {
  const router = useRouter();
  const { artistId } = router.query; // Récupérer l'ID de l'artiste à partir des paramètres d'URL
  const [artist, setArtist] = useState([]);
  const [artistInfo, setArtistInfo] = useState({});
  const [followersCount, setFollowersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  const [activeTab, setActiveTab] = useState("gallery");

  const artistData = {
    id: artistId,
    username: "FLoby Officiel",
    photo: "./Floby1.jpg",
    followers: 1000,
  };

  useEffect(() => {
    setArtist(artistData);
  }, [artistId]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  const formattedUsername = artistData.username
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
    name: "John Doe",
    bio: "Lorem ipsum dolor sit amet consectetur. Aliquet neque mauris proin lacus dignissim. Aliquam placerat velit tristique neque. Amet pharetra id a sit. Risus condimentum mi amet sit. Tellus non urna magna metus bibendum. Quis amet quam proin consequat ut sit interdum. Lacus in ipsum integer maecenas tortor nisl. Risus sit tincidunt id phasellus eu tempor urna sollicitudin viverra. Sit id lorem commodo arcu scelerisque facilisis quam.",
    // Add other properties as needed
  };
  // Fonction pour diviser les photos en groupes de deux
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

  // Diviser les photos en paires
  const photoPairs = splitPhotosIntoPairs(userPhotos);
  return (
    <>
      <Navigation />
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
              src={artist.photo}
              alt={artistData.username}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginRight: "15px",
              }}
            />
            <div className={styles.artistFollowersContainer}>
              <div>
                <span className={styles.artistUsername}>
                  {artistData.username}
                </span>
              </div>
              <div>
                <span className={styles.artistLink}>@{formattedUsername}</span>
                <span style={{ marginRight: "5px" }}>•</span>
                <span className={styles.artistFollowers}>
                  {formatFollowersCount(artistData.followers)} abonné(s)
                </span>
              </div>
            </div>
          </div>
          <div className={`${styles.artistButtonContainer}`}>
            <IconButton
              icon={<FontAwesomeIcon icon={faWarning} />}
              label="Se désabonner"
              buttonColor="white"
              textColor="red"
              iconColor="red"
              iconPosition="left"
              borderColor="red"
              border
              onClick={openModal}
            />
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
                        // Placez ici le code à exécuter lorsque l'utilisateur confirme le désabonnement
                        setShowModal(false); // Ferme la modal après la confirmation
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
                  Cher utilisateur/trice, en vous désabonnant de ce compte, vous
                  n'aurez plus accès aux différents contenus qui y sont liés.
                  Êtes-vous sûr(e) de vouloir continuer et vous désabonner ?
                </Text>
              </Box>
            </Modal>
          )}
        </div>

        <div
          style={{
            // marginTop: "12px",
            backgroundColor: "white",
            padding: "12px",
            width: "435px",
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "15px",
          }}
        >
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
            <div className={`${styles.galleryContainer}`}>
              {photoPairs.map((pair, index) => (
                <>
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                      marginTop: "2px",
                    }}
                  >
                    {pair.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt={`Photo ${photo.id}`}
                        style={{
                          width: "200px",
                          height: "200px",
                          marginRight: "10px",
                        }}
                      />
                    ))}
                  </div>
                </>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>
                    Précédent
                  </button>
                )}
                {userPhotos.length > currentPage * 6 && (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>
                    Suivant
                  </button>
                )}
              </div>
            </div>
          )}
          {activeTab === "about" ? <About userInfo={userInfo} /> : null}
        </div>

        <div className={styles.sidemenu}>
          <SideMenu
            username="John Doe"
            fansCount={5000}
            userPhoto="user_photo.jpg"
          />
        </div>
      </div>
    </>
  );
};

export default ProfileArtisteImages;
