// SimplePost.jsx
import React from "react";
import { formatMomentText } from "./utils"; // Utilitaire pour formater le moment
import Image from "next/image";
const SimplePost = ({
  profilePhoto,
  username,
  moment,
  postText,
  media,
  lastLikeUser,
  likesCount,
  commentsCount,
  // Autres propriétés spécifiques au post simple
}) => {
  return (
    <div className="simple-post">
      <div className="post-header">
        <Image
          src={profilePhoto}
          alt="Photo de profil"
          className="profile-photo"
        />
        <span className="username">{username}</span>
        <span className="moment">{formatMomentText(moment)}</span>
      </div>
      <p className="post-text">{postText}</p>
      {media && <Image src={media} alt="Photo" className="post-media" />}
      <div className="likes-comments">
        <span>
          {lastLikeUser} et {likesCount - 1} autres personnes aiment ceci
        </span>
        <span>
          - {commentsCount} commentaire{commentsCount !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Ajoutez ici le reste du contenu spécifique au post simple */}
    </div>
  );
};

export default SimplePost;
