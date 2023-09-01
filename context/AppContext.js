import React, { createContext, useState, useContext, useEffect } from "react";
import { USER_DETAILS_URL, SIMPLE_POST, EVENT_POST } from "@/configs/api";
import axios from "axios";
import allowedRoutes from "@/components/allowedRoutes";
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState([]);
  const [eventPosts, setEventPosts] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [commentEventData, setCommentEventData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState("");

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(SIMPLE_POST, { headers });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }

      const processedPosts = response.data.map((post) => {
        setCommentData(post.comments);
        return {
          ...post,
          commentData: post.comments,
        };
      });

      setPosts(processedPosts);
      setIsLoading(false);
      if (processedPosts.length > 0) {
        setCommentData(processedPosts[0].commentData);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  const updatePosts = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  const updateEventPosts = (newEventPost) => {
    setEventPosts((prevEventPosts) => [newEventPost, ...prevEventPosts]);
  };

  const fetchEventPosts = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(EVENT_POST, { headers });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }
      const processedPosts = response.data.map((post) => {
        const commentData = post.comments;
        return {
          ...post,
          commentData: post.comments,
        };
      });

      setEventPosts(processedPosts);
      setIsLoading(false);
      if (processedPosts.length > 0) {
        setCommentEventData(processedPosts[0].commentEventData);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEventPosts();
    }
  }, [token]);

  const fetchUserList = async () => {
    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(USER_DETAILS_URL, { headers });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from the server.");
      }

      setUserList(response.data);
      //   console.log("userList", userList);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      fetchUserList();
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    clearContext();
  };

  const clearContext = () => {
    setPosts([]);
    setEventPosts([]);
    setCommentData([]);
    setCommentEventData([]);
    setIsLoading(false);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAuthenticated,
        setIsAuthenticated,
        posts,
        setPosts,
        eventPosts,
        setEventPosts,
        commentData,
        setCommentData,
        commentEventData,
        setCommentEventData,
        isloading,
        setIsLoading,
        error,
        setError,
        logout,
        clearContext,
        userList,
        setUserList,
        updatePosts,
        updateEventPosts,
        fetchEventPosts,
        fetchPosts,
        userId,
        setUserId,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
5;
