import React from "react";
import Navigation from "@/components/Nav1";
import EventPage from "./EventPage"; // Importez le composant EventPage
import ExplorerPage from "./ExplorerPage"; // Importez le composant ExplorerPage

const Home = () => {
  // Votre code actuel...

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Navigation />
      <div className={styles.container}>
        <div className={styles.sideDiv}>
          <div className={styles.content} style={{ padding: "20px" }}>
            <EventPage /> {/* Utilisez le composant EventPage ici */}
          </div>
        </div>
        <div className={styles.centerDiv}>
          <div className={styles.scrollWrapper}>
            <div className={styles.content}>
              <ExplorerPage /> {/* Utilisez le composant ExplorerPage ici */}
            </div>
          </div>
        </div>
        {/* ... */}
      </div>
    </div>
  );
};

export default Home;
