import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL, BASIC_URL } from "@/configs/api";
import { useAppContext } from "../context/AppContext";
import CustomButton from "@/components/NickButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../app/pages.module.css";
import { faSignOut, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

const Abonnement = () => {
  const { user, token, setUser, setToken, setIsAuthenticated } =
    useAppContext();
  const [userPhoto, setUserPhoto] = useState("");
  const [showOverlayPanel, setShowOverlayPanel] = useState(false);
  const [userIdentity, setUserIdentity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 1200);
  };
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const toggleOverlayPanel = () => {
    setShowOverlayPanel((prev) => !prev);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showOverlayPanel && event.target.closest(".overlay-panel")) {
        setShowOverlayPanel((prev) => !prev);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showOverlayPanel]);

  const getUserImage = async () => {
    try {
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
        setUserPhoto(imageUrl);
      } else {
        // console.log("Nous n'avons pas pu recuperer l'url de l'image");
      }
    } catch (error) {
      //   console.log(
      //     "Une erreur s'est produite lors de la récupération de l'URL de l'image de profil.",
      //     error
      //   );
    }
  };

  useEffect(() => {
    getUserImage();
  }, [userIdentity, getUserImage]);

  const handleLogout = () => {
    router.push("/");
    logout();
  };
  const imageStyle = {
    borderRadius: "50%",
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
        </div>

        <div className="user-info">
          <span onClick={toggleOverlayPanel} className="user-initial">
            {user?.username.charAt(0)}
          </span>
          <span className="username">{user?.username}</span>
        </div>
      </nav>
      {showOverlayPanel && (
        <div
          className="overlay-panel"
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            bottom: 0,
            backgroundColor: "ButtonFace",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderWidth: 1,
            height: "180px",
            padding: 10,
            borderRadius: 20,
            width: 280,
          }}
        >
          <div
            className="overlay-title"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 15px",
            }}
          >
            <div className={`${styles["user"]}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={
                    userPhoto !== `${BASIC_URL}null` && userPhoto !== null
                      ? userPhoto
                      : "/user1.png"
                  }
                  alt="User Avatar"
                  width={40}
                  height={40}
                  unoptimized
                  style={imageStyle}
                />
                <span style={{ fontSize: 18, color: "black", paddingLeft: 12 }}>
                  {user?.username}
                </span>
                <span />
              </div>
            </div>
          </div>
          <div className="overlay-content">
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "90vh",
              }}
            >
              <div>
                <div
                  className={`${styles["overlay-link"]} ${styles["link-logout"]}`}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faSignOut}
                    className={styles["link-icon"]}
                  />
                  Déconnexion
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
              <div>Exclusivity © 2023. Tout droit réservé</div>
            </div>
          </div>
        </div>
      )}
      <div className="content-wrapper">
        <div>
          <h1 className="title">Abonnement</h1>
          <h2 className="subscription-text">
            Cher utilisateur veuillez vous abonner pour accéder à plus de
            contenu!
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <CustomButton
            text={isLoading ? "Chargement en cours..." : "M'abonner"}
            buttonColor="blue"
            type="button"
            rounded
            fullWidth={true}
          />
        </div>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between; /* Pour espacer le logo et les informations de l'utilisateur */
          align-items: center;
          padding: 0.5rem;
          background-color: #fff;
          color: white;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo {
          display: inline-block;
        }

        .logo img {
          width: 100px;
          height: 50px;
        }

        /* Style pour les informations de l'utilisateur */
        .user-info {
          display: block; /* Par défaut, masquez les informations de l'utilisateur */
          //   background-color: #ccc;
          color: black;
        }

        .username {
          font-weight: bold;
          color: "black";
        }

        .subscription-text {
          font-size: 18px;
          text-align: center;
          color: #333; /* Couleur de texte de votre choix */
          margin-top: 20px; /* Espacement par rapport au titre */
        }

        .user-initial {
          font-size: 16px;
          margin-left: 4px; /* Pour espacer la première lettre du nom d'utilisateur */
          border: 1px solid #ccc;
          width: 40px;
          height: 40px;
          padding: 10px;
          border-radius: 10px;
          margin-right: 5px;
          cursor: pointer;
        }
        .user-initial:hover {
          font-size: 16px;
          margin-left: 4px; /* Pour espacer la première lettre du nom d'utilisateur */
          border: 1px solid blue;
          width: 40px;
          height: 40px;
          padding: 10px;
          border-radius: 10px;
          background-color: blue;
          color: white;
        }

        .content-wrapper {
          padding: 20px;
          max-width: 800px;
          margin: 70px auto; /* Ajustez la marge supérieure en fonction de la hauteur de la barre de navigation */
          display: flex;
          flex-direction: column;
        }

        .title {
          font-size: 36px;
          text-align: center;
          margin-bottom: 20px;
        }

        .content {
          font-size: 16px;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 20px;
          }

          .content {
            font-size: 14px;
          }

          /* Affiche les informations de l'utilisateur en dessous de 600px */
          .user-info {
            display: block;
            text-align: center;
          }
          .username {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Abonnement;
