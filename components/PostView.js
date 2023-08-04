import React, { useRef, useState, useEffect } from "react";
import styles from "../app/PostView.module.css";
import { Box, Flex, TextField, IconButton } from "gestalt";
import formatMomentText from "../utils/utils";
import { API_URL, LIKE } from "@/configs/api";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

const PostView = ({
  profilePhoto,
  username,
  moment,
  postText,
  media,
  video,
  lastLikeUser,
  likesCount,
  commentsCount,
  recentComment,
  commentData,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  postId,
}) => {
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const displayedComments = showAllComments
    ? comments || []
    : (comments || []).slice(0, 3);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [showCommentField, setShowCommentField] = useState(false);
  const [commentInputValue, setCommentInputValue] = useState("");
  const [lastLikedUser, setLastLikedUser] = useState("");
  const [areRepliesLoaded, setAreRepliesLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isEvent = !!eventTitle;
  const [likedUsers, setLikedUsers] = useState([]);
  const {
    user,
    token,
    isAuthenticated,
    setUser,
    setToken,
    setIsAuthenticated,
  } = useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchLikedUsers = async () => {
      try {
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${API_URL}/postes/postes/${postId}/likes/`,
          config
        );

        // Extraire les ID des utilisateurs qui ont liké le poste
        const likedUserIds = response.data.map((like) => like.user);
        // console.log(likedUserIds);
        // Mettre à jour l'état des utilisateurs qui ont liké le poste
        setLikedUsers(likedUserIds);

        // Vérifier si l'utilisateur actuellement connecté a déjà liké le poste
        setLiked(likedUserIds.includes(userIdentity.username));
      } catch (error) {
        console.error("Erreur lors de la récupération des likes :", error);
      }
    };

    fetchLikedUsers();
  }, [token, postId, userIdentity?.id]);

  const Refresh = async () => {
    try {
      if (!token) {
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/postes/postes/${postId}/likes/`,
        config
      );

      // Extraire les ID des utilisateurs qui ont liké le poste
      const likedUserIds = response.data.map((like) => like.user);
      // console.log(likedUserIds);
      // Mettre à jour l'état des utilisateurs qui ont liké le poste
      setLikedUsers(likedUserIds);

      // Vérifier si l'utilisateur actuellement connecté a déjà liké le poste
      setLiked(likedUserIds.includes(userIdentity.username));
    } catch (error) {
      console.error("Erreur lors de la récupération des likes :", error);
    }
  };

  useEffect(() => {
    // Fonction pour récupérer les commentaires et les réponses associées au poste
    const fetchPostDetails = async () => {
      try {
        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${API_URL}/postes/posts/${postId}/comments`,
          config
        );
        console.log(response.data);
        // Extraire les données des commentaires et des réponses de la réponse
        const commentsWithRepliesData = response.data.comments;
        // Mettre à jour l'état des commentaires et des réponses
        setComments(commentsWithRepliesData);
        // console.log("--", comments);

        // ... autres mises à jour de l'état comme les likes, etc.
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails du poste :",
          error
        );
      }
    };

    fetchPostDetails();
  }, [token, postId, userIdentity?.id]);

  useEffect(() => {
    if (isVisible && !areRepliesLoaded) {
      setAreRepliesLoaded(true);
    }
  }, [isVisible, areRepliesLoaded]);

  const handleLike = async () => {
    try {
      if (!token) {
        console.error("Utilisateur non authentifié.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!liked) {
        // L'utilisateur n'a pas encore liké le poste, effectuer un like
        const data = {
          user: userIdentity?.id,
          post: postId,
        };
        const response = await axios.post(
          `${API_URL}/postes/postes/${postId}/likes/`,
          data,
          config
        );
        setLikedUsers((prevLikedUsers) => [
          ...prevLikedUsers,
          userIdentity?.id,
        ]);
        Refresh();
        // console.log("Like réussi!");
      } else {
        const data = {
          user: userIdentity?.id,
          post: postId,
        };
        // L'utilisateur a déjà liké le poste, effectuer un dislike
        const response = await axios.post(
          `${API_URL}/postes/postes/${postId}/likes/`,
          data,
          config
        );
        Refresh();

        setLikedUsers((prevLikedUsers) =>
          prevLikedUsers.filter((userId) => userId !== userIdentity?.id)
        );
        // console.log("Dislike réussi!");
      }

      // Mettre à jour l'état du like dans le frontend
      setLiked(!liked);
    } catch (error) {
      console.error("Erreur lors de la requête de like/dislike :", error);
    }
  };

  const handleShowAllComments = () => {
    setShowAllComments(true);
  };

  const handleReduceComments = () => {
    setShowAllComments(false);
  };

  const formatCount = (likes) => {
    if (likes >= 1000000000) {
      return (likes / 1000000000).toFixed(1) + "B";
    } else if (likes >= 1000000) {
      return (likes / 1000000).toFixed(1) + "M";
    } else if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + "K";
    } else {
      return likes;
    }
  };

  const handleToggleCommentField = () => {
    setShowCommentField((prevShowCommentField) => !prevShowCommentField);
  };
  const handleSendComment = async () => {
    try {
      if (!token) {
        console.error("Utilisateur non authentifié.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        user: userIdentity?.id,
        content: commentInputValue,
      };
      const response = await axios.post(
        `${API_URL}/postes/posts/${postId}/comments/`,
        data,
        config
      );
    } catch (error) {
    } finally {
      setCommentInputValue("");
    }
  };
  const formatLikeText = () => {
    if (likesCount === 0) {
      return null; // Ne rien afficher si aucun like
    } else if (
      likesCount === 1 &&
      likedUsers.includes(userIdentity?.username)
    ) {
      return "Vous aimez ce poste";
    } else if (likesCount === 1) {
      return "1 personne aime ce poste";
    } else if (likedUsers.includes(userIdentity?.username)) {
      return `Vous et ${likesCount - 1} personne${
        likesCount === 2 ? "" : "s"
      } aiment ce poste`;
    } else {
      return `${likesCount} personnes aiment ce poste`;
    }
  };
  return (
    <div className={styles.postViewContainer}>
      <div className={styles.userInfo}>
        <img
          src={profilePhoto}
          alt="Photo de profil"
          className={styles.profilePhoto}
        />
        <div className={styles.usernameMoment}>
          <span className={styles.username}>{username}</span>
          <span className={styles.separator}>|</span>
          <span className={styles.moment}>
            il y'a {formatMomentText(moment)}
          </span>
        </div>
      </div>
      <div className={styles.postInfo}>
        {isEvent && (
          <div className={styles.eventInfo}>
            <span className={styles.eventTitle}>{eventTitle}</span>
            <div className={styles.eventDateTime}>
              <div>
                <span className={styles.icon}>🗓️</span>
                <span className={styles.eventDate}>{eventDate}</span>
              </div>
              <div>
                <span className={styles.icon}>⏰</span>
                <span className={styles.eventTime}>{eventTime}</span>
              </div>
              <div>
                <span className={styles.icon}>📍</span>
                <span className={styles.eventLocation}>{eventLocation}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.postContent}>
        <p>{postText}</p>
        {media && !video && (
          <img src={media} alt="Photo" className={styles.media} />
        )}
        {video && (
          <video controls className={styles.video}>
            <source src={video} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
        )}
        <div className={styles.likes}>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {likesCount > 0 ? (
              <span>{formatLikeText() && formatLikeText()}</span>
            ) : (
              ""
            )}
            {commentsCount > 0 ? (
              <span>
                {" "}
                - {formatCount(commentsCount)} commentaire
                {commentsCount !== 1 ? "s" : ""}
              </span>
            ) : (
              <div className={styles.noCommentsText}>
                | Soyez la première personne à commenter ce poste
              </div>
            )}
          </div>
        </div>
        <Box display="flex" direction="row">
          <div className={styles.likeButtonContainer}>
            <button
              className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
              onClick={handleLike}
            >
              👍
              <span className={liked ? styles.likedText : styles.likeText}>
                {liked ? "Vous aimez " : "J'aime"}
              </span>
            </button>
          </div>
          <div style={{ marginLeft: "10px" }}>
            {/* Bouton "Commenter" */}
            <button
              className={styles.commentButton}
              onClick={handleToggleCommentField}
            >
              💬 Commenter
            </button>
          </div>
        </Box>
        <div className={styles.separatorBar} />
        <div className={styles.addComment}>
          {showCommentField && (
            <Box
              alignItems="center"
              justifyContent="space-between"
              display="flex"
              direction="row"
              width="100%"
              marginTop={2}
            >
              <Box width="100%">
                <TextField
                  placeholder="Ajouter un commentaire"
                  value={commentInputValue}
                  onChange={({ value }) => setCommentInputValue(value)}
                />
              </Box>
              <div style={{ marginLeft: "auto" }}>
                <IconButton
                  icon="send"
                  accessibilityLabel="Envoyer"
                  size="lg"
                  onClick={handleSendComment}
                />
              </div>
            </Box>
          )}
        </div>

        <div className={styles.comments}>
          {/* Afficher le texte "Soyez le premier à commenter ceci" lorsque qu'il n'y a pas de commentaire */}
          {commentData?.length === 0 && (
            <div className={styles.noCommentsText}>
              Soyez le premier à commenter ceci
            </div>
          )}
          {/* {Object.values(commentData)?.map((comment, index) => ( */}
          <Comment
            key={index}
            comment={CommentData}
            repliesVisible={CommentData?.replies && comment?.replies.length > 0}
            // lastCommentUser={
            //   commentData?.replies &&
            //   comment?.replies[comment?.replies?.length - 1].username
            // }
            replyCount={CommentData?.replies ? comment?.replies?.length : 0}
          />
          {/* ))} */}
          {commentData?.length > 3 && !showAllComments && (
            <button
              className={styles.showMoreButton}
              onClick={handleShowAllComments}
            >
              Afficher plus de commentaires
            </button>
          )}
          {showAllComments && (
            <button
              className={styles.reduceCommentsButton}
              onClick={handleReduceComments}
            >
              Réduire les commentaires
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Comment = ({ commentData }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  // const [likeCount, setLikeCount] = useState(comment.likeCount);
  // const [commentCount, setCommentCount] = useState(comment.commentCount);
  const [showReplies, setShowReplies] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(3);
  const [isVisible, setIsVisible] = useState(false);

  const commentRef = useRef(null);

  const handleLike = () => {
    setLiked((prevLiked) => !prevLiked);
    setLikeCount((prevLikeCount) =>
      liked ? prevLikeCount - 1 : prevLikeCount + 1
    );
  };
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Définissez la valeur de seuil appropriée pour votre cas
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsVisible(entry.isIntersecting);
    }, options);

    // Commencez à observer le commentaire
    if (commentRef.current) {
      observer.observe(commentRef.current);
    }

    // Nettoyez l'observer lorsque le composant est démonté
    return () => {
      if (commentRef.current) {
        observer.unobserve(commentRef.current);
      }
    };
  }, []);

  // Fonction pour charger plus de réponses
  const handleLoadMoreReplies = () => {
    // Augmenter le nombre de réponses visibles
    setVisibleReplies((prevVisibleReplies) => prevVisibleReplies + 3);
  };

  const handleReplyClick = () => {
    setShowReplyInput(true);
  };

  const handleToggleReplies = () => {
    setShowReplies((prevShowReplies) => !prevShowReplies);
  };

  const handleSendReply = () => {
    // Ajoutez ici la logique pour envoyer la réponse au backend
    // Utilisez la valeur de replyText pour envoyer la réponse
    console.log("Réponse:", replyText);
    // Réinitialisez l'état et cachez le champ de réponse après avoir envoyé la réponse
    setReplyText("");
    setShowReplyInput(false);
    // Incrémentez le nombre de commentaires lorsque vous ajoutez une réponse
    setCommentCount(commentCount + 1);
  };

  return (
    <div className={styles.comment} ref={commentRef}>
      <Box>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={commentData?.profilePhoto}
              alt="Photo de profil du commentaire"
              className={styles.commentProfilePhoto}
            />
            <span className={styles.commentUsername}>
              {commentData.username}
            </span>
          </div>
          <span className={styles.commentMoment}>
            {formatMomentText(commentData.moment)}
          </span>
        </div>
        <p className={styles.commentText}>{commentData.content}</p>
        <Box display="flex" direction="row">
          <button
            className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            J'aime ·👍{likeCount}
          </button>
          {!showReplyInput && (
            <button className={styles.replyButton} onClick={handleReplyClick}>
              | Répondre
            </button>
          )}
          <span style={{ marginLeft: "10px" }}>
            · {commentCount} commentaire{commentCount !== 1 ? "s" : ""}
          </span>
        </Box>
        {showReplyInput && (
          <Box
            alignItems="center"
            justifyContent="space-between"
            display="flex"
            direction="row"
            width="100%"
            marginTop={2}
          >
            <Box width="100%">
              <TextField
                placeholder="Répondre au commentaire..."
                value={replyText}
                onChange={({ value }) => setReplyText(value)}
              />
            </Box>
            <div style={{ marginLeft: "auto" }}>
              <IconButton
                icon="send"
                accessibilityLabel="Envoyer"
                size="lg"
                onClick={handleSendReply}
              />
            </div>
          </Box>
        )}

        {/* Afficher les réponses associées à ce commentaire si showReplies est vrai */}
        {showReplies && (
          <div className={styles.replies}>
            {commentData.replies &&
              commentData.replies
                .slice(0, visibleReplies)
                .map((reply, index) => <Comment key={index} comment={reply} />)}
            {commentData.replies &&
              commentData.replies.length > visibleReplies && (
                <button
                  className={styles.loadMoreRepliesButton}
                  onClick={handleLoadMoreReplies}
                >
                  Charger plus de réponses (
                  {commentData.replies.length - visibleReplies})
                </button>
              )}
          </div>
        )}
        {/* Afficher le nombre de réponses si le commentaire a des réponses */}
        {commentData.replies && commentData.replies.length > 0 && (
          <button
            className={styles.viewRepliesButton}
            onClick={handleToggleReplies}
            style={{ color: "blue" }}
          >
            {showReplies
              ? "Masquer les réponses"
              : `Voir les réponses (${commentData.replies.length})`}
          </button>
        )}
      </Box>
    </div>
  );
};

export default PostView;
