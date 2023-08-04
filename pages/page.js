import React from "react";

const MyPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Div fixe à gauche */}
      <div
        style={{
          flex: "0 0 25%",
          backgroundColor: "blue",
          height: "100%",
          overflow: "hidden",
        }}
      >
        Contenu fixe 1
      </div>

      {/* Div scrollable au milieu */}
      <div
        style={{
          flex: "0 0 50%",
          justifyContent: "center",
          backgroundColor: "green",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Contenu scrollable (à l'intérieur de la div du milieu) */}
        <div
          style={{
            height: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Insérez ici le contenu scrollable (des "posts") */}
          <div
            style={{
              width: "80%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: "200px",
                  margin: "10px",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                Post {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Div fixe à droite */}
      <div
        style={{
          flex: "0 0 25%",
          backgroundColor: "red",
          height: "100%",
          overflow: "hidden",
        }}
      >
        Contenu fixe 2
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          /* Masquer les divs de côté sur les petits écrans */
          div:nth-child(1),
          div:nth-child(3) {
            display: none;
          }

          /* La div verte (milieu) occupe tout l'espace et est centrée sur les petits écrans */
          div:nth-child(2) {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default MyPage;
