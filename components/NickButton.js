import React, { useState } from "react";
function CustomButton({
  text,
  isLoading,
  onClick,
  buttonColor,
  rounded,
  type,
  fullWidth,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const colorSchemes = {
    blue: {
      bgColor: "#0000FF",
      textColor: "white",
    },
    red: {
      bgColor: "red",
      textColor: "white",
    },
    white: {
      bgColor: "white",
      textColor: "black",
    },
    gray: {
      bgColor: "gray",
      textColor: "black",
    },
  };
  const hoverStyles = {
    blue: {
      backgroundColor: "#6094F2",
    },
    red: {
      backgroundColor: "#F25E5E",
    },
    white: {
      backgroundColor: "#eeeeee",
    },
    gray: {
      backgroundColor: "#666666",
    },
  };

  const clickStyles = {
    blue: {
      backgroundColor: "#004c99",
    },
    red: {
      backgroundColor: "#cc0000",
    },
    white: {
      backgroundColor: "#cccccc",
    },
    gray: {
      backgroundColor: "#444444",
    },
  };

  // Sélectionner la combinaison de couleurs en fonction de la valeur de colorScheme
  const selectedColorScheme = colorSchemes[buttonColor] || colorSchemes.blue;

  const buttonStyle = {
    backgroundColor: selectedColorScheme.bgColor,
    color: selectedColorScheme.textColor,
    borderRadius: rounded ? "40px" : "6px",
    padding: "10px 20px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
    ...(isHovered && {
      backgroundColor: hoverStyles[buttonColor].backgroundColor,
    }),
    ...(isClicked && {
      backgroundColor: clickStyles[buttonColor].backgroundColor,
    }),
    width: fullWidth ? "100%" : "auto",
  };

  const handleButtonClick = () => {
    if (!isLoading && onClick) {
      setIsClicked(true); // Marquer le bouton comme "cliqué" lors du clic
      onClick();
    }
  };

  return (
    <button
      className={`custom-button ${isLoading ? "loading" : ""}`}
      onMouseEnter={() => setIsHovered(true)} // Gérer l'événement survol
      onMouseLeave={() => setIsHovered(false)} // Gérer l'événement fin de survol
      onMouseDown={() => setIsClicked(true)} // Gérer l'événement clic
      onMouseUp={() => setIsClicked(false)} // Gérer l'événement fin de clic
      onClick={handleButtonClick}
      disabled={isLoading}
      type={type || "button"}
      style={buttonStyle}
    >
      {isLoading ? "Chargement en cours..." : text}
    </button>
  );
}

export default CustomButton;
