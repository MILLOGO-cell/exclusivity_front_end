import React, { useState } from "react";
import { Box, Button } from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowRight,
  faArrowLeft,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../app/SuggestionBoard.module.css";
import IconButton from "./IconButton";

const ITEMS_PER_PAGE = 3;

const SuggestionBoard = ({ suggestions }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  // Utiliser un objet plutôt qu'un tableau pour l'état followingStates
  const [followingStates, setFollowingStates] = useState(
    suggestions.reduce((map, suggestion) => {
      map[suggestion.id] = false;
      return map;
    }, {})
  );
  const displayedSuggestions = showAll
    ? suggestions
    : suggestions.slice(startIndex, endIndex);

  const handleFollow = (suggestionId) => {
    setFollowingStates((prevStates) => ({
      ...prevStates,
      [suggestionId]: !prevStates[suggestionId],
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
      <h2 className={styles.suggestionBoardTitle}>Des suggestions</h2>
      <hr className={styles.suggestionBoardDivider} />
      {displayedSuggestions.map((suggestion, index) => {
        return (
          <div key={index} className={styles.suggestionItemWrapper}>
            <Item
              photo={suggestion.photo}
              username={suggestion.username}
              following={followingStates[suggestion.id] || false}
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

const Item = ({ photo, username, suggestionId, following, onFollow }) => {
  return (
    <div className={styles.suggestionItemContainer}>
      <img src={photo} alt="Profile" className={styles.profilePhoto} />
      <div className={styles.usernameContainer}>
        <div className={styles.username}>{username}</div>
        <div className={styles.usernameLowercase}>
          @{username.toLowerCase()}
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
          onClick={() => onFollow(suggestionId)}
        />
      </div>
    </div>
  );
};

export default SuggestionBoard;
