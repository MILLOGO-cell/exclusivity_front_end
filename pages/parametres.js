import React, { useState } from "react";
import Tabs from "@/components/Tabs";

const Parametres = () => {
  const [activeTab, setActiveTab] = useState("publications");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  function PublicationsTab() {
    return <div>Contenu des publications</div>;
  }

  function ProfilTab() {
    return <div>Contenu du profil</div>;
  }

  function AboutTab() {
    return <div>Contenu À propos</div>;
  }

  function SubscriptionTab() {
    return <div>Contenu abonnement</div>;
  }

  function ConfidentialTab() {
    return <div>Contenu confidentialité</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
          minHeight: "100vh",
        }}
      >
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
        {activeTab === "publications" && <PublicationsTab />}
        {activeTab === "profil" && <ProfilTab />}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "abonnement" && <SubscriptionTab />}
        {activeTab === "confidentialite" && <ConfidentialTab />}
      </div>
    </div>
  );
};

export default Parametres;
