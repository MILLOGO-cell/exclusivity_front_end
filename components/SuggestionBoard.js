import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "@/context/AppContext";
import {
  faPlus,
  faArrowRight,
  faArrowLeft,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../app/SuggestionBoard.module.css";
import IconButton from "./IconButton";
import Link from "next/link";
const ITEMS_PER_PAGE = 3;
import {
  BASIC_URL,
  SUBSCRIBE_URL,
  UNSUBSCRIBE_URL,
  USER_DETAILS,
} from "@/configs/api";
import axios from "axios";
import Image from "next/image";
import ModalSubscription from "./Modal";

const SuggestionBoard = ({ suggestions }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const { token, setUser, setToken, userDetails, setUserDetails } =
    useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);

  const fetchUserDetails = async () => {
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
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, []);

  const isUserFollowingCreator = (creatorId) => {
    if (userDetails && userDetails?.subscribed_creators) {
      return userDetails?.subscribed_creators.includes(creatorId);
    }
    return false;
  };

  const handleFollow = (suggestionId) => {
    const isFollowing = isUserFollowingCreator(suggestionId);
    const action = isFollowing ? "unsubscribe" : "subscribe";

    const requestBody = {
      creator: suggestionId,
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
          fetchUserDetails();
        } else {
          throw new Error("Erreur lors de la requête");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'abonnement/désabonnement :", error);
      });
  };
  const displayedSuggestions = showAll
    ? suggestions
    : suggestions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  return (
    <div className={styles.suggestionBoardContainer}>
      <h2 className={styles.suggestionBoardTitle}>Des suggestions</h2>
      <hr className={styles.suggestionBoardDivider} />
      {displayedSuggestions.map((suggestion, index) => {
        const isUserSubscribed = isUserFollowingCreator(suggestion.id);
        return (
          <div key={index} className={styles.suggestionItemWrapper}>
            <Item
              photo={
                suggestion.image !== `${BASIC_URL}null`
                  ? `${BASIC_URL}${suggestion.image}`
                  : "/user1.png"
              }
              suggestionId={suggestion.id}
              username={suggestion.username}
              isUserFollowing={isUserSubscribed}
              onFollow={() => handleFollow(suggestion.id)}
            />
          </div>
        );
      })}
      {suggestions.length > ITEMS_PER_PAGE && !showAll && (
        <div className={styles.suggestionButtonContainer}>
          {currentPage > 1 && (
            <IconButton
              icon={<FontAwesomeIcon icon={faArrowLeft} />}
              label="Page précédente"
              buttonColor="white"
              textColor="black"
              iconColor="black"
              iconPosition="left"
              border
              onClick={handlePrevPage}
            />
          )}

          {endIndex < suggestions.length && (
            <IconButton
              icon={<FontAwesomeIcon icon={faArrowRight} />}
              label="Page suivante"
              buttonColor="white"
              textColor="black"
              iconColor="black"
              iconPosition="right"
              border
              onClick={handleNextPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Item = ({ photo, username, suggestionId, onFollow, isUserFollowing }) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleFollowClick = () => {
    if (isUserFollowing) {
      onFollow();
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const imageStyle = {
    width: "48px",
    height: "48px",
    marginRight: "10px",
    borderRadius: "24px",
  };
  return (
    <div className={styles.suggestionItemContainer}>
      <div className={styles.blockUserInfo}>
        <Link href={`/profil_utilisateur?id=${suggestionId}`} passHref>
          <Image
            src={photo ? photo : "../user1.png"}
            alt="Profile"
            style={imageStyle}
            width={64}
            height={64}
            unoptimized
          />
        </Link>
        <div className={styles.usernameContainer}>
          <div className={styles.username}>{username}</div>
          <div className={styles.usernameLowercase}>
            @{username.toLowerCase()}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "20px" }}>
        <IconButton
          icon={
            isUserFollowing ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )
          }
          label={isUserFollowing ? "Suivi" : "Suivre"}
          buttonColor={isUserFollowing ? "blue" : "white"}
          textColor={isUserFollowing ? "white" : "black"}
          iconColor={isUserFollowing ? "white" : "blue"}
          iconPosition="right"
          border
          borderColor={isUserFollowing ? "blue" : "#ccc"}
          // onClick={() => onFollow()}
          onClick={handleFollowClick}
        />
      </div>
      {showSubscriptionModal && (
        <ModalSubscription
          suggestionId={suggestionId}
          userName={username}
          userImage={photo}
          onFollow={() => onFollow()}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  );
};

export default SuggestionBoard;
