import React, { useRef, useState, useEffect } from "react";
import styles from "../app/PostView.module.css";
import { Box, Flex, TextField, IconButton } from "gestalt";
import formatMomentText from "../utils/utils";
import { API_URL, BASIC_URL } from "@/configs/api";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsUp as faThumbsUpSolid,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";

const PostView = ({
  profilePhoto,
  id,
  username,
  moment,
  postText,
  media,
  likesCount,
  commentsCount,
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
  const { token, setToken, fetchPosts, fetchEventPosts } = useAppContext();
  const [userIdentity, setUserIdentity] = useState(null);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    setUserIdentity(JSON.parse(storedUser));
    setToken(storedToken);
  }, [token]);

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
          `${API_URL}/postes/postes/${
            eventTitle ? "event" : "simple"
          }/${postId}/likes/`,
          config
        );

        const likedUserIds = response.data.map((like) => like.user);
        setLikedUsers(likedUserIds);

        setLiked(likedUserIds.includes(userIdentity?.username));
      } catch (error) {
        // console.error("Erreur lors de la récupération des likes :", error);
      }
    };

    fetchLikedUsers();
  }, [token, postId, userIdentity?.id, eventTitle, userIdentity?.username]);

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
        `${API_URL}/postes/postes/${
          eventTitle ? "event" : "simple"
        }/${postId}/likes/`,
        config
      );

      const likedUserIds = response.data.map((like) => like.user);
      setLikedUsers(likedUserIds);

      setLiked(likedUserIds.includes(userIdentity.username));
    } catch (error) {
      console.error("Erreur lors de la récupération des likes :", error);
    }
  };

  useEffect(() => {
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
        const commentsWithRepliesData = response.data.comments;
        setComments(commentsWithRepliesData);
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

      const data = {
        user: userIdentity?.id,
        post: postId,
      };

      const response = await axios.post(
        `${API_URL}/postes/postes/${
          eventTitle ? "event" : "simple"
        }/${postId}/likes/`,
        data,
        config
      );

      if (response.status === 201 || response.status === 200) {
        setLiked(!liked);

        if (!liked) {
          setLikedUsers((prevLikedUsers) => [
            ...prevLikedUsers,
            userIdentity?.id,
          ]);
        } else {
          setLikedUsers((prevLikedUsers) =>
            prevLikedUsers.filter((userId) => userId !== userIdentity?.id)
          );
        }

        Refresh();
      } else {
        console.error("La requête de like/dislike a échoué.");
      }
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
        parent_comment_id: null, // Mettez ici l'ID du commentaire parent si applicable, sinon laissez-le à null pour un commentaire direct au post.
      };

      const response = await axios.post(
        `${API_URL}/postes/${
          eventTitle ? "eventposts" : "simpleposts"
        }/${postId}/comments/`,
        data,
        config
      );
      fetchPosts();
      fetchEventPosts();
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
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
      return "Vous aimez ce poste ·";
    } else if (likesCount === 1) {
      return isSmallScreen ? (
        <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
      ) : (
        "1 personne aime ce poste ·"
      );
    } else if (likedUsers.includes(userIdentity?.username)) {
      return isSmallScreen ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span> Vous et {likesCount - 1}</span>
          <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
        </div>
      ) : (
        `Vous et ${likesCount - 1} personne${
          likesCount === 2 ? "" : "s"
        } aimez ce poste ·`
      );
    } else {
      return isSmallScreen ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span> {likesCount}</span>
          <FontAwesomeIcon icon={faHeart} style={{ color: "red" }} />
        </div>
      ) : (
        `${likesCount} personnes aiment ce poste ·`
      );
    }
  };

  const rootComments = commentData?.filter(
    (comment) => comment.parent_comment === null
  );

  const imageStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "8px",
  };
  const mediaStyle = {
    maxWidth: "100%",
    width: "100%",
    height: "auto",
    marginBottom: "8px",
  };
  return (
    <div className={styles.postViewContainer}>
      <Link
        href={
          id === userIdentity?.id ? "/profil" : `/profil_utilisateur?id=${id}`
        }
        passHref
      >
        <div className={styles.userInfos}>
          <Image
            src={profilePhoto || "/user1.png"}
            alt="Photo de profil"
            style={imageStyle}
            width={40}
            height={40}
            unoptimized
          />
          <div className={styles.usernameMoment}>
            <span className={styles.username}>{username}</span>
            <span className={styles.separator}>|</span>
            <span className={styles.moment}>
              il y&apos;a {formatMomentText(moment)}
            </span>
          </div>
        </div>
      </Link>
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
        {media && (
          <div className={styles.mediaContainer}>
            {media.includes(".mp4") ? (
              <video controls className={styles.media}>
                <source src={media} type="video/mp4" />
                Votre navigateur ne prend pas en charge la lecture de vidéos.
              </video>
            ) : (
              <Image
                src={media}
                alt="Media"
                style={mediaStyle}
                width={500}
                height={700}
                unoptimized
              />
            )}
          </div>
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
            {isSmallScreen ? (
              commentsCount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: 30,
                    marginLeft: 0,
                  }}
                >
                  {commentsCount}
                  <FontAwesomeIcon icon={faComment} style={{ color: "gray" }} />
                </div>
              )
            ) : (
              <span className={`hide-on-small-screen ${styles.commentCount}`}>
                {commentsCount > 0 ? (
                  <span>
                    {" "}
                    {formatCount(commentsCount)} commentaire
                    {commentsCount !== 1 ? "s" : ""}
                  </span>
                ) : (
                  ""
                )}
              </span>
            )}
          </div>
        </div>
        <Box display="flex" direction="row">
          <div className={styles.likeButtonContainer}>
            <button
              className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
              onClick={handleLike}
            >
              {liked ? (
                <span style={{ color: "blue" }}>J&apos;aime ·👍 </span>
              ) : (
                <span style={{ color: "black" }}>J&apos;aime ·👍 </span>
              )}
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
          {rootComments?.length === 0 && (
            <div className={styles.noCommentsText}>
              Soyez le première personne à commenter ce poste.
            </div>
          )}
          {rootComments?.map((comment, index) => (
            <Comment
              key={index}
              commentData={comment}
              token={token}
              userIdentity={userIdentity}
              postId={postId}
            />
          ))}
          {rootComments?.length > 3 && !showAllComments && (
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

const Comment = ({ commentData, token, userIdentity, postId, level = 0 }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(commentData?.comment_count);
  const [showReplies, setShowReplies] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const commentRef = useRef(null);
  const { fetchPosts, fetchEventPosts } = useAppContext();
  const [likedUsers, setLikedUsers] = useState([]);
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const Refresh = () => {
    setLiked(commentData?.liked_users.includes(userIdentity?.username));
  };

  useEffect(() => {
    Refresh();
  }, [commentData, userIdentity]);

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

      const likeData = {
        user: userIdentity?.id,
      };

      const endpoint = `${API_URL}/postes/postes/comment/${commentData?.id}/likes/`;

      const response = await axios.post(endpoint, likeData, config);

      if (response.status === 201 || response.status === 200) {
        // Mettre à jour l'état du like dans le frontend
        setLiked(!liked);

        // Mettre à jour la liste des utilisateurs aimés
        if (!liked) {
          setLikedUsers((prevLikedUsers) => [
            ...prevLikedUsers,
            userIdentity?.id,
          ]);
        } else {
          setLikedUsers((prevLikedUsers) =>
            prevLikedUsers.filter((userId) => userId !== userIdentity?.id)
          );
        }

        // Vous n'avez pas montré la définition de la fonction Refresh, assurez-vous qu'elle fonctionne correctement

        // console.log("Opération de like/dislike réussie!");
      } else {
        console.error("La requête de like/dislike a échoué.");
      }
    } catch (error) {
      console.error("Erreur lors de la requête de like/dislike :", error);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    // Copiez la valeur de commentRef.current dans une variable locale
    const currentCommentRef = commentRef.current;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsVisible(entry.isIntersecting);
    }, options);

    if (currentCommentRef) {
      observer.observe(currentCommentRef);
    }

    return () => {
      if (currentCommentRef) {
        observer.unobserve(currentCommentRef);
      }
    };
  }, [commentRef, setIsVisible]);

  const handleLoadMoreReplies = () => {
    setVisibleReplies((prevVisibleReplies) => prevVisibleReplies + 3);
  };

  const handleReplyClick = () => {
    setShowReplyInput(true);
  };

  const handleToggleReplies = () => {
    setShowReplies((prevShowReplies) => !prevShowReplies);
  };
  const handleSendReply = async () => {
    try {
      if (!token || !userIdentity || !userIdentity.id) {
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
        content: replyText,
        parent_comment_id: commentData.id,
      };
      const response = await axios.post(
        `${API_URL}/postes/posts/${postId}/comments/`,
        data,
        config
      );
      fetchPosts();
      fetchEventPosts();
      const newReplyData = response.data;
      const totalReplyCountFromAPI = newReplyData.commentCount;

      setCommentCount(totalReplyCountFromAPI);

      setReplyText("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
    }
  };
  const commentProfilePhotoStyle = {
    width: " 32px",
    height: "32px",
    borderRadius: "50%",
    marginRight: "8px",
  };
  return (
    <div className={styles.comment} ref={commentRef}>
      <div style={{ marginLeft: `${level * 30}px` }}>
        <div className={styles.commentWrapper}>
          <div className={styles.userInfo}>
            <Link
              href={
                commentData?.user_details?.id === userIdentity?.id
                  ? "/profil"
                  : `/profil_utilisateur?id=${commentData?.user_details?.id}`
              }
              passHref
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {commentData?.user_details?.image ? (
                  <Image
                    src={
                      commentData.user_details.image.startsWith("http")
                        ? commentData.user_details.image
                        : `${BASIC_URL}${commentData.user_details.image}`
                    }
                    // src={commentData.user_details.image}
                    alt="Photo"
                    style={commentProfilePhotoStyle}
                    width={32}
                    height={32}
                    unoptimized
                  />
                ) : (
                  <img
                    src="/user1.png"
                    alt="Default"
                    style={commentProfilePhotoStyle}
                    width={32}
                    height={32}
                  />
                )}
                <span className={styles.commentUsername}>
                  {commentData?.user_details?.username}
                </span>
              </div>
            </Link>
            <span className={styles.commentMoment}>
              {formatMomentText(new Date(commentData?.created_at))}
            </span>
          </div>
          <div className={styles.commentData}>
            <span className={styles.commentText}>{commentData.content}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            {liked ? (
              <div>
                <FontAwesomeIcon
                  icon={faThumbsUpSolid}
                  style={{ color: "blue" }}
                />{" "}
                <span className="hide-on-small-screen">Vous aimez</span>
              </div>
            ) : (
              <div>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: "gray" }} />{" "}
                <span className="hide-on-small-screen"> J&apos;aime</span>
              </div>
            )}
          </button>

          {!showReplyInput && (
            <button className={styles.replyButton} onClick={handleReplyClick}>
              | Répondre
            </button>
          )}
          {isSmallScreen ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "40px",
                marginLeft: "4px",
              }}
            >
              · {commentCount}
              <FontAwesomeIcon icon={faComment} style={{ color: "gray" }} />
            </div>
          ) : (
            <span className={`hide-on-small-screen ${styles.commentCount}`}>
              · {commentCount > 0 ? commentCount : "0 "}{" "}
              {commentCount > 1 ? "commentaires" : "commentaire"}
            </span>
          )}
        </div>
        {showReplyInput && (
          <div className={styles.InputWrapper}>
            <div>
              <input
                type="text"
                placeholder="Répondre au commentaire..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.sendButton}>
              <button onClick={handleSendReply}>Envoyer</button>
            </div>
          </div>
        )}
        {showReplies && (
          <div className={styles.replies}>
            {commentData.sub_comments &&
              commentData.sub_comments.map((reply) => (
                <div key={reply.id} className={styles.subCommentSeparator}>
                  <Comment
                    commentData={reply}
                    token={token}
                    userIdentity={userIdentity}
                    postId={postId}
                    // level={level + 1}
                  />
                </div>
              ))}
            {commentData.sub_comments &&
              commentData.sub_comments.length > visibleReplies && (
                <button
                  className={styles.loadMoreRepliesButton}
                  onClick={handleLoadMoreReplies}
                >
                  Charger plus de réponses (
                  {commentData.sub_comments.length - visibleReplies})
                </button>
              )}
          </div>
        )}
        {commentData?.sub_comments && commentData.sub_comments.length > 0 && (
          <button
            className={styles.viewRepliesButton}
            onClick={handleToggleReplies}
            style={{ color: "blue" }}
          >
            {showReplies
              ? "Masquer les réponses"
              : `Voir les réponses (${commentData?.sub_comments.length})`}
          </button>
        )}
      </div>
      <style jsx>{`
        @media screen and (max-width: 768px) {
          .hide-on-small-screen {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PostView;
