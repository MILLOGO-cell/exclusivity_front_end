import React, { useState } from "react";
import { Box } from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faPlus,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../app/SuggestionBoard.module.css";
import IconButton from "./IconButton";
import Link from "next/link";

const ITEMS_PER_PAGE = 3;

const SubscriptionBoard = ({ subscriptions }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Utiliser un objet plutôt qu'un tableau pour l'état followingStates
  const [followingStates, setFollowingStates] = useState(
    subscriptions.reduce((map, subcription) => {
      map[subcription.id] = false;
      return map;
    }, {})
  );
  const displayedSubcription = showAll
    ? subscriptions
    : subscriptions.slice(startIndex, endIndex);

  const handleFollow = (userId) => {
    setFollowingStates((prevStates) => ({
      ...prevStates,
      [userId]: !prevStates[userId],
    }));
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  return (
    <div className={styles.suggestionBoardContainer}>
      <h2 className={styles.suggestionBoardTitle}>Abonnements</h2>
      <hr className={styles.suggestionBoardDivider} />
      {displayedSubcription.map((subscription, index) => {
        return (
          <div key={index} className={styles.suggestionItemWrapper}>
            <SubscriptionItem
              photo={subscription.photo}
              username={subscription.username}
              userId={subscription.id}
            />
          </div>
        );
      })}
      {subscriptions.length > ITEMS_PER_PAGE && !showAll && (
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

          {endIndex < subscriptions.length && (
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

const SubscriptionItem = ({ photo, username, userId }) => {
  const handleUnsubscribe = () => {
    // Placez ici le code pour gérer le désabonnement de l'utilisateur avec l'ID "userId"
    // Vous pouvez utiliser une fonction pour supprimer l'utilisateur de la liste des abonnements
    // par exemple : handleUnsubscribe(userId)
  };

  return (
    <div className={styles.suggestionItemContainer}>
      <Link href={`/profilArtisteImages/${userId}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <div style={{}}>
            <img src={photo} alt="Profile" className={styles.profilePhoto} />
          </div>
          <div className={styles.usernameContainer}>
            <div className={styles.username}>{username}</div>
            <div className={styles.usernameLowercase}>
              @{username.toLowerCase()}
            </div>
          </div>
        </div>
      </Link>
      <div style={{ marginLeft: " " }}>
        <IconButton
          icon={<FontAwesomeIcon icon={faEyeSlash} />}
          label="Désabonner"
          buttonColor="white"
          textColor="red"
          //   iconColor="red"
          //   iconPosition="right"
          border
          borderColor="red"
          onClick={handleUnsubscribe}
        />
      </div>
    </div>
  );
};

export default SubscriptionBoard;
