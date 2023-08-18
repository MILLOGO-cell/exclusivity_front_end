import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

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
import { BASIC_URL, SUBSCRIBE_URL, UNSUBSCRIBE_URL } from "@/configs/api";
import axios from "axios";

const SuggestionBoard = ({ suggestions }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const { token, setUser, setToken, userId, setUserId } = useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, []);

  // Utiliser le localStorage pour initialiser l'état local des abonnements
  const [followingStates, setFollowingStates] = useState(
    suggestions.reduce((map, suggestion) => {
      const storedFollowingState = localStorage.getItem(
        `followingState_${suggestion.id}`
      );
      map[suggestion.id] = storedFollowingState === "true";
      return map;
    }, {})
  );
  const displayedSuggestions = showAll
    ? suggestions
    : suggestions.slice(startIndex, endIndex);

  const handleFollow = (suggestionId, isFollowing) => {
    const action = isFollowing ? "unsubscribe" : "subscribe";
    const requestBody = {
      creator: suggestionId,
      subscriber: userIdentity?.id,
    };
    // Sélectionnez l'URL appropriée en fonction de l'action
    const apiUrl = action === "subscribe" ? SUBSCRIBE_URL : UNSUBSCRIBE_URL;
    // Effectuez la requête appropriée pour abonner ou désabonner l'utilisateur
    axios
      .post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Vérifiez la réponse de l'API ici
        if (response.status === 200 || response.status === 201) {
          // Mettez à jour l'état de suivi ici en fonction de la réponse de l'API
          setFollowingStates((prevStates) => {
            const newFollowingStates = {
              ...prevStates,
              [suggestionId]: !prevStates[suggestionId],
            };
            // Sauvegarde de l'état d'abonnement dans le localStorage
            localStorage.setItem(
              `followingState_${suggestionId}`,
              newFollowingStates[suggestionId]
            );
            return newFollowingStates;
          });
        } else {
          throw new Error("Erreur lors de la requête");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'abonnement/désabonnement :", error);
      });
  };

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
        return (
          <div key={index} className={styles.suggestionItemWrapper}>
            <Item
              photo={`${BASIC_URL}${suggestion.image}`}
              suggestionId={suggestion.id}
              username={suggestion.username}
              following={followingStates[suggestion.id] || false}
              onFollow={() =>
                handleFollow(suggestion.id, followingStates[suggestion.id])
              }
              setUserId={setUserId}
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

const Item = ({
  photo,
  username,
  suggestionId,
  following,
  onFollow,
  setUserId,
}) => {
  return (
    <div className={styles.suggestionItemContainer}>
      <div className={styles.blockUserInfo}>
        <Link href={`/profil_utilisateur?id=${suggestionId}`} passHref>
          {/* <Link onClick={setUserId(suggestionId)} href={`/profil_utilisateur/ `}> */}
          <img
            src={photo ? photo : "../user1.png"}
            alt="Profile"
            className={styles.profilePhoto}
            width={64}
            height={64}
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
            following ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )
          }
          label={following ? "Suivi" : "Suivre"}
          buttonColor={following ? "blue" : "white"}
          textColor={following ? "white" : "black"}
          iconColor={following ? "white" : "blue"}
          iconPosition="right"
          border
          borderColor={following ? "blue" : "#ccc"}
          onClick={() => onFollow(suggestionId, following)}
        />
      </div>
    </div>
  );
};

export default SuggestionBoard;
