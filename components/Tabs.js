import React, { useState, useEffect } from "react";
import styles from "../app/Tabs.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Tabs = ({ activeTab, onTabChange }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showAdditionalTabs, setShowAdditionalTabs] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleAdditionalTabs = () => {
    setShowAdditionalTabs(!showAdditionalTabs);
  };

  const handleAdditionalTabClick = (tab) => {
    onTabChange(tab);
    setShowAdditionalTabs(false); // Fermez le menu déroulant lorsque vous cliquez sur un élément
  };

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "profil" ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange("profil")}
        >
          Profil
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "publications" ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange("publications")}
        >
          Publications
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "about" ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange("about")}
        >
          À propos
        </button>
        {!isSmallScreen && (
          <>
            <button
              className={`${styles.tabButton} ${
                activeTab === "abonnement" ? styles.activeTab : ""
              }`}
              onClick={() => onTabChange("abonnement")}
            >
              Abonnements
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "confidentialite" ? styles.activeTab : ""
              }`}
              onClick={() => onTabChange("confidentialite")}
            >
              Confidentialité
            </button>
          </>
        )}

        {isSmallScreen && (
          <button
            className={` ${styles.dropdownButton} ${showAdditionalTabs}`}
            onClick={toggleAdditionalTabs}
          >
            Plus
            <FontAwesomeIcon
              icon={faChevronDown}
              style={{
                color: "black",
                backgroundColor: "white",
                borderRadius: "25px",
              }}
            />
          </button>
        )}
        {showAdditionalTabs && isSmallScreen && (
          <div className={styles.additionalTabs}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "abonnement" ? styles.activeTab : ""
              }`}
              onClick={() => handleAdditionalTabClick("abonnement")}
            >
              Abonnements
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "confidentialite" ? styles.activeTab : ""
              }`}
              onClick={() => handleAdditionalTabClick("confidentialite")}
            >
              Confidentialité
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
