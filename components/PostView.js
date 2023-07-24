import React, { useRef, useState, useEffect } from "react";
import styles from "../app/PostView.module.css";
import { Box, Flex, TextField, IconButton } from "gestalt";
import formatMomentText from "../utils/utils";

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
  comments,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const displayedComments = showAllComments ? comments : comments.slice(0, 3);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [showCommentField, setShowCommentField] = useState(false);
  const [commentInputValue, setCommentInputValue] = useState("");
  const [lastLikedUser, setLastLikedUser] = useState("");
  const [areRepliesLoaded, setAreRepliesLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Déterminer si le post est un événement en vérifiant si le titre est présent
  const isEvent = !!eventTitle;
  // Utilisez un effet pour charger les réponses supplémentaires lorsque le commentaire devient visible
  useEffect(() => {
    if (isVisible && !areRepliesLoaded) {
      // Ajoutez ici la logique pour charger les réponses supplémentaires
      // Une fois les réponses chargées, mettez à jour l'état `areRepliesLoaded` pour éviter de les charger à nouveau
      setAreRepliesLoaded(true);
    }
  }, [isVisible, areRepliesLoaded]);

  const handleLike = () => {
    if (!liked) {
      setLikes((prevLikes) => prevLikes + 1);
      setLastLikedUser(username); // Mettre à jour le dernier utilisateur qui a aimé
    } else {
      setLikes((prevLikes) => prevLikes - 1);
      setLastLikedUser(""); // Réinitialiser le dernier utilisateur qui a aimé
    }
    setLiked((prevLiked) => !prevLiked);
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

  const handleSendComment = () => {
    // Ajoutez ici la logique pour envoyer le commentaire
    // Vous pouvez utiliser commentInputValue pour obtenir le contenu du commentaire
    // Réinitialisez la valeur du champ après avoir envoyé le commentaire
    setCommentInputValue("");
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
          <span className={styles.moment}>{formatMomentText(moment)}</span>
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
            {/* Ajoutez des balises de source supplémentaires pour prendre en charge d'autres formats vidéo si nécessaire */}
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
            <span>
              {/* Afficher "Vous" au lieu du dernier utilisateur qui a aimé */}
              {lastLikedUser === username ? "Vous" : lastLikeUser} et{" "}
              {formatCount(likes - 1)} autres personnes aiment ceci
            </span>
            <span>
              {" "}
              - {formatCount(commentsCount)} commentaire
              {commentsCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <Box display="flex" direction="row">
          <div className={styles.likeButtonContainer}>
            <button
              className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
              onClick={handleLike}
            >
              👍
            </button>
            <span className={liked ? styles.likedText : styles.likeText}>
              J'aime
            </span>
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
          {comments.length === 0 && (
            <div className={styles.noCommentsText}>
              Soyez le premier à commenter ceci
            </div>
          )}
          {comments.map((comment, index) => (
            <Comment
              key={index}
              comment={comment}
              repliesVisible={comment.replies && comment.replies.length > 0}
              lastCommentUser={
                comment.replies &&
                comment.replies[comment.replies.length - 1].username
              }
              replyCount={comment.replies ? comment.replies.length : 0}
            />
          ))}
          {comments.length > 3 && !showAllComments && (
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

const Comment = ({ comment }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [commentCount, setCommentCount] = useState(comment.commentCount);
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
              src={comment.profilePhoto}
              alt="Photo de profil du commentaire"
              className={styles.commentProfilePhoto}
            />
            <span className={styles.commentUsername}>{comment.username}</span>
          </div>
          <span className={styles.commentMoment}>
            {formatMomentText(comment.moment)}
          </span>
        </div>
        <p className={styles.commentText}>{comment.text}</p>
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
            {comment.replies &&
              comment.replies
                .slice(0, visibleReplies)
                .map((reply, index) => <Comment key={index} comment={reply} />)}
            {comment.replies && comment.replies.length > visibleReplies && (
              <button
                className={styles.loadMoreRepliesButton}
                onClick={handleLoadMoreReplies}
              >
                Charger plus de réponses (
                {comment.replies.length - visibleReplies})
              </button>
            )}
          </div>
        )}
        {/* Afficher le nombre de réponses si le commentaire a des réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <button
            className={styles.viewRepliesButton}
            onClick={handleToggleReplies}
            style={{ color: "blue" }}
          >
            {showReplies
              ? "Masquer les réponses"
              : `Voir les réponses (${comment.replies.length})`}
          </button>
        )}
      </Box>
    </div>
  );
};

export default PostView;
