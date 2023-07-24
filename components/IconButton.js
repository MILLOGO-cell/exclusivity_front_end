import React, { useState } from "react";
import Link from "next/link";

const IconButton = ({
  icon,
  href,
  label,
  onClick,
  buttonColor,
  textColor,
  iconColor,
  border,
  iconPosition, // Ajout de la prop iconPosition pour spécifier la position de l'icône
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const lightenColor = (color, amount) => {
    const parseColor = (c) => parseInt(c, 16);
    const lighten = (c) =>
      Math.round(Math.min(Math.max(0, c + c * (amount / 100)), 255));
    const r = lighten(parseColor(color.substr(1, 2)));
    const g = lighten(parseColor(color.substr(3, 2)));
    const b = lighten(parseColor(color.substr(5, 2)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const buttonStyles = {
    backgroundColor: isClicked ? lightenColor(buttonColor, 20) : buttonColor,
    color: textColor,
    borderRadius: 18,
    transition: "background-color 0.3s, color 0.3s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    border: border ? "1px solid #ccc" : "none", // Ajout de la bordure si la prop border est true
  };

  const iconStyles = {
    color: iconColor,
    margin: iconPosition === "left" ? "0 0.5rem 0 0" : "0 0 0 0.5rem", // Ajuster l'espace entre l'icône et le texte selon la position de l'icône
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseUp = () => {
    setIsClicked(false);
  };

  return (
    // Utiliser la balise Link de Next.js si la prop href est fournie, sinon utiliser un bouton simple
    href ? (
      <Link href={href} passHref>
        <button
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="px-2 py-1 rounded focus:outline-none"
          style={buttonStyles}
        >
          {iconPosition === "left" && icon && (
            <span style={iconStyles}>{icon}</span>
          )}
          <span style={{ color: textColor }}>{label}</span>
          {iconPosition === "right" && icon && (
            <span style={iconStyles}>{icon}</span>
          )}
        </button>
      </Link>
    ) : (
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="px-2 py-1 rounded focus:outline-none"
        style={buttonStyles}
      >
        {iconPosition === "left" && icon && (
          <span style={iconStyles}>{icon}</span>
        )}
        <span style={{ color: textColor }}>{label}</span>
        {iconPosition === "right" && icon && (
          <span style={iconStyles}>{icon}</span>
        )}
      </button>
    )
  );
};

export default IconButton;
