import React from "react";
import Image from "next/image";
const Gallery = ({ photos }) => {
  // Vous pouvez utiliser une bibliothèque de galerie d'images comme react-image-gallery
  // ou créer votre propre affichage élégant des photos ici.
  return (
    <div>
      {photos.map((photo, index) => (
        <Image key={index} src={photo.url} alt={`Photo ${index + 1}`} />
      ))}
    </div>
  );
};

export default Gallery;
