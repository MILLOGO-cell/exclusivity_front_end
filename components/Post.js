import React from "react";
import { Box, Flex, Text, Video } from "gestalt";
import styles from "../app/Post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const Post = ({
  username,
  userPhoto,
  timestamp,
  content,
  mediaUrl,
  mediaType,
}) => {
  const imageStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50px",
    marginRight: "8px",
  };
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const postImageStyle = {
    width: "100%",
  };
  const now = new Date();
  const timeDifference = now - timestamp;
  const oneMinuteInMilliseconds = 60 * 1000;

  return (
    <div className={styles.wrapper}>
      <div className={styles.userPost}>
        <div className={styles.userInfo}>
          <div>
            <div className={styles.userBlock}>
              <Image
                src={userPhoto || "/user1.png"}
                alt="Photo de profil"
                style={imageStyle}
                width={40}
                height={40}
                unoptimized
              />
              <div className={styles.userNameBlock}>
                <span className={styles.user}>{username}</span>
                <span> @{username}</span>
              </div>
              <div className={styles.icon}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "blue" }}
                />
              </div>
            </div>
          </div>
          <span>il y&apos;a {timestamp}</span>
        </div>
        <div className={styles.post}>
          <span className={styles.postContent}>{content}</span>
          {mediaUrl.includes(".mp4") ? (
            <video controls className={styles.postMedia}>
              <source src={mediaUrl} type="video/mp4" />
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
          ) : (
            <div className={styles.postMedia}>
              <Image
                alt="Photo"
                src={mediaUrl}
                // width={400}
                // height={600}

                fill
                unoptimized
                sizes="(max-width: 768px) 100 vw, 700px"
                style={{
                  width: "100%",
                  // height: isSmallScreen ? "280px" : "800px",
                  height: "100%",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
