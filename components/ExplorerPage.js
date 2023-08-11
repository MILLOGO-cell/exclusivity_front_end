import React from "react";
import styles from "../app/pages.module.css";
import CreatePost from "@/components/CreatePost";
import { useAppContext } from "@/context/AppContext";
import PostView from "@/components/PostView";

const ExplorerPage = () => {
  const {
    posts,
    userImage,
    isLoading,
    loadingDotsCount,
    renderPostView,
    sortedPosts,
  } = useAppContext();

  return (
    <div className={styles.content}>
      <div className={styles.create}>
        <CreatePost userPhoto={userImage} updatePosts={setUpdatePosts} />
      </div>
      {isLoading ? (
        <div className={styles.loading}>
          Chargement...
          {".".repeat(loadingDotsCount)}
        </div>
      ) : (
        sortedPosts.map((post, index) => (
          <div key={index} className={styles.postWrapper}>
            {renderPostView(post)}
          </div>
        ))
      )}
    </div>
  );
};

export default ExplorerPage;
