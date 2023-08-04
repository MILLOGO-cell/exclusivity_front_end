import React from "react";

const About = ({ userInfo }) => {
  // Affichez les informations de l'utilisateur ici, par exemple :
  return (
    <div style={{ marginTop: "10px" }}>
      <h1 style={{ fontWeight: "bold" }}>Biographie:</h1>
      <h2>{userInfo.name},</h2>
      <p>{userInfo.bio}</p>
      {/* Afficher d'autres informations sur l'utilisateur ici */}
    </div>
  );
};

export default About;
