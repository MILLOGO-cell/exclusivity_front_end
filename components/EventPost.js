// EventPost.jsx
import React, { useRef, useState, useEffect } from "react";
import { formatMomentText } from "../utils/utils"; // Utilitaire pour formater le moment
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const EventPost = ({
  profilePhoto,
  username,
  moment,
  postText,
  media,
  lastLikeUser,
  likesCount,
  commentsCount,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  // Autres propriétés spécifiques à l'événement
}) => {
  const {
    user,
    setUser,
    setToken,
    token,
    isAuthenticated,
    setIsAuthenticated,
    fetchEventPosts,
    updateEventPosts,
    eventPosts,
  } = useAppContext();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, [setToken]);

  return (
    <div className="event-post">
      <div className="post-header">
        <Image
          src={profilePhoto}
          alt="Photo de profil"
          className="profile-photo"
        />
        <span className="username">{username}</span>
        <span className="moment">{formatMomentText(moment)}</span>
      </div>
      <div className="event-info">
        <h2 className="event-title">{eventTitle}</h2>
        <p className="event-date">{eventDate}</p>
        <p className="event-time">{eventTime}</p>
        <p className="event-location">{eventLocation}</p>
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
      {/* Ajoutez ici le reste du contenu spécifique à l'événement */}
    </div>
  );
};

export default EventPost;
