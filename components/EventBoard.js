import React, { useState } from "react";
import { IconButton as GestaltIconButton, Flex } from "gestalt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "../app/EventBoard.module.css";
import IconButton from "./IconButton";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

const ITEMS_PER_PAGE = 3;

const EventBoard = ({ events }) => {
  const [showAll, setShowAll] = useState(false);
  // const displayedEvents = showAll ? events : events.slice(0, 3);
  const [currentPage, setCurrentPage] = useState(1);
  // Calculer l'index de début et de fin des événements à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedEvents = events.slice(startIndex, endIndex);

  const handleShowAll = () => {
    // setShowAll(true);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handleReduce = () => {
    setShowAll(false);
  };

  return (
    <div className={styles.eventBoardContainer}>
      <Flex
        direction="row"
        justifyContent="between"
        alignContent="center"
        alignItems="center"
      >
        <h2 className={styles.eventBoardTitle}>Évènements</h2>
        <div
          style={{
            backgroundColor: "blue",
            border: "2px solid white",
            borderRadius: "20px",
          }}
        ></div>
      </Flex>
      <hr className={styles.eventBoardDivider} />
      {displayedEvents.map((event, index) => (
        <Item
          key={index}
          photo={event.media}
          date={
            event.date
              ? format(new Date(event?.date), "dd MMMM yyyy", { locale: fr })
              : ""
          }
          title={event.title}
        />
      ))}
      {events.length > ITEMS_PER_PAGE && !showAll && (
        <>
          <div className={styles.pagination}>
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
            {endIndex < events.length && (
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
        </>
      )}
    </div>
  );
};

const Item = ({ photo, date, title }) => {
  const isVideo = photo && photo.includes(".mp4");
  const imageStyle = {
    width: "64px",
    height: "64px",
    marginRight: "10px",
    borderRadius: "10px",
  };

  return (
    <div className={styles.itemContainer}>
      {isVideo ? (
        <video className={styles.itemMedia} controls>
          <source src={photo} type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture de vidéos.
        </video>
      ) : (
        <Image
          src={photo || ""}
          alt="Event"
          style={imageStyle}
          width={16}
          height={16}
          unoptimized
        />
      )}
      <div>
        <div className={styles.itemDate}>{date}</div>
        <div className={styles.itemTitle}>{title}</div>
      </div>
    </div>
  );
};

export default EventBoard;
