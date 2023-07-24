import React, { useState, useEffect } from "react";
import "@/app/globals.css";
import {
  Box,
  Modal,
  Flex,
  Image,
  Sticky,
  CompositeZIndex,
  FixedZIndex,
  SideNavigation,
  Container,
  Text,
} from "gestalt";
import Navigation from "@/components/Navigation";
import SideMenu from "@/components/SideMenu";
import EventBoard from "@/components/EventBoard";
import SuggestionBoard from "@/components/SuggestionBoard";
import CreatePost from "@/components/CreatePost";
import PostView from "@/components/PostView";
import "intersection-observer";

const events = [
  {
    photo: "../logo.png",
    date: "01/08/2023",
    title: "Événement 1",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 2",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 3",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 4",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 5",
  },
  {
    photo: "../logo.png",
    date: "05/08/2023",
    title: "Événement 6",
  },
];
const suggestions = [
  {
    id: 1,
    photo: "../logo.png",
    username: "utilisateur1",
  },
  {
    id: 2,
    photo: "../logo.png",
    username: "utilisateur2",
  },
  {
    id: 3,
    photo: "../logo.png",
    username: "utilisateur3",
  },
  {
    id: 4,
    photo: "../logo.png",
    username: "utilisateur4",
  },
  {
    id: 5,
    photo: "../logo.png",
    username: "utilisateur5",
  },
  // {
  //   photo: "lien_vers_photo2.jpg",
  //   username: "utilisateur2",
  // },
  // {
  //   photo: "lien_vers_photo2.jpg",
  //   username: "utilisateur2",
  // },
];

const comment1 = {
  profilePhoto: "../logo.png",
  username: "@mackery",
  moment: Date.now() - 50000,
  text: "Commentaire 1",
  likeCount: 10,
  commentCount: 2,
  replies: [
    {
      profilePhoto: "../logo.png",
      username: "Utilisateur1",
      moment: Date.now() - 50000,
      text: "Réponse 1 au commentaire 1",
      likeCount: 5,
      commentCount: 1,
      replies: [
        {
          profilePhoto: "../logo.png",
          username: "Utilisateur2",
          moment: Date.now() - 50000,
          text: "Réponse 1 à la réponse 1 au commentaire 1",
          likeCount: 2,
          commentCount: 0,
          replies: [],
        },
      ],
    },
    {
      profilePhoto: "../logo.png",
      username: "Utilisateur3",
      moment: Date.now() - 50000,
      text: "Réponse 2 au commentaire 1",
      likeCount: 3,
      commentCount: 0,
      replies: [],
    },
  ],
};

const comment2 = {
  profilePhoto: "../logo.png",
  username: "@moussier",
  moment: Date.now() - 50000,
  text: "Commentaire 2",
  likeCount: 7,
  commentCount: 1,
  replies: [
    {
      profilePhoto: "../logo.png",
      username: "Utilisateur4",
      moment: Date.now() - 50000,
      text: "Réponse 1 au commentaire 2",
      likeCount: 2,
      commentCount: 0,
      replies: [],
    },
  ],
};

const post = {
  profilePhoto: "../logo.png",
  eventTitle: "Concert Live",
  eventDate: "24 Aout2023",
  eventTime: "10h30",
  eventLocation: "Ouagadougou, Salle des banquets de Ouaga 2000",
  username: "@nicolas",
  moment: Date.now() - 50000,
  postText:
    "Lorem ipsum dolor sit amet consectetur. Id elementum in pellentesque est euismod tristique sed volutpat quis. Faucibus enim praesent viverra sed placerat a orci felis. Non nisi tellus tortor lectus dui velit.",
  media: "../Floby1.jpg",
  lastLikeUser: "@amazing",
  likesCount: 40,
  commentsCount: 5000,
  comments: [comment1, comment2],
  recentComment: {
    profilePhoto: "lien_vers_la_photo_de_profil_commentaire",
    username: "Utilisateur2",
    moment: Date.now() - 50000,
    text: "Commentaire 1",
  },
};

const post1 = {
  profilePhoto: "../logo.png",
  eventTitle: "Concert Live",
  eventDate: "24 Aout2023",
  eventTime: "10h30",
  eventLocation: "Ouagadougou, Salle des banquets de Ouaga 2000",
  username: "@nicolas",
  moment: Date.now() - 50000,
  postText:
    "Lorem ipsum dolor sit amet consectetur. Id elementum in pellentesque est euismod tristique sed volutpat quis. Faucibus enim praesent viverra sed placerat a orci felis. Non nisi tellus tortor lectus dui velit.",
  media: "../Floby1.jpg",
  lastLikeUser: "@amazing",
  likesCount: 40,
  commentsCount: 5000,
  comments: [comment1, comment2],
  recentComment: {
    profilePhoto: "lien_vers_la_photo_de_profil_commentaire",
    username: "Utilisateur2",
    moment: Date.now() - 50000,
    text: "Commentaire 1",
  },
};

const post2 = {
  profilePhoto: "../logo.png",
  eventTitle: "Concert Live",
  eventDate: "24 Aout2023",
  eventTime: "10h30",
  eventLocation: "Ouagadougou, Salle des banquets de Ouaga 2000",
  username: "@nicolas",
  moment: Date.now() - 50000,
  postText:
    "Lorem ipsum dolor sit amet consectetur. Id elementum in pellentesque est euismod tristique sed volutpat quis. Faucibus enim praesent viverra sed placerat a orci felis. Non nisi tellus tortor lectus dui velit.",
  media: "../Floby1.jpg",
  lastLikeUser: "@amazing",
  likesCount: 40,
  commentsCount: 5000,
  comments: [comment1, comment2],
  recentComment: {
    profilePhoto: "lien_vers_la_photo_de_profil_commentaire",
    username: "Utilisateur2",
    moment: Date.now() - 50000,
    text: "Commentaire 1",
  },
};

const post3 = {
  profilePhoto: "../logo.png",
  eventTitle: "Concert Live",
  eventDate: "24 Aout2023",
  eventTime: "10h30",
  eventLocation: "Ouagadougou, Salle des banquets de Ouaga 2000",
  username: "@nicolas",
  moment: Date.now() - 50000,
  postText:
    "Lorem ipsum dolor sit amet consectetur. Id elementum in pellentesque est euismod tristique sed volutpat quis. Faucibus enim praesent viverra sed placerat a orci felis. Non nisi tellus tortor lectus dui velit.",
  media: "../Floby1.jpg",
  lastLikeUser: "@amazing",
  likesCount: 40,
  commentsCount: 5000,
  comments: [comment1, comment2],
  recentComment: {
    profilePhoto: "lien_vers_la_photo_de_profil_commentaire",
    username: "Utilisateur2",
    moment: Date.now() - 50000,
    text: "Commentaire 1",
  },
};
const posts = [post, post1, post2, post3];
const Explorer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const BOX_ZINDEX = new FixedZIndex(100);
  const STICKY_ZINDEX = new CompositeZIndex([new FixedZIndex(1)]);
  const logoStyle = {
    width: "100%",
    height: "auto",
    alignSelf: "flex-start",
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSmallScreen(window.innerWidth < 600); // Mettre à jour la taille initiale

      function handleResize() {
        setIsSmallScreen(window.innerWidth < 600); // Mettre à jour la taille lors du redimensionnement de l'écran
      }

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisl nec turpis vehicula ultrices. Duis pretium ut ipsum nec interdum. Vestibulum arcu dolor, consectetur ac eros a, varius commodo justo. Maecenas tincidunt neque elit, eu pretium arcu dictum ac. Donec vehicula mauris ut erat dictum, eget tempus elit luctus. In volutpat felis justo, et venenatis arcu viverra in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin enim lorem, vulputate eget imperdiet nec, dapibus sed diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse rhoncus ut leo non gravida. Nulla tincidunt tellus sit amet ornare venenatis. Sed quis lorem cursus, porttitor tellus sed, commodo ex. Praesent blandit pretium faucibus. Aenean orci tellus, vulputate id sapien sit amet, porta fermentum quam. Praesent sem risus, tristique sit amet pulvinar in, scelerisque sit amet massa.";
  return (
    <Box
      dangerouslySetInlineStyle={{ __style: { isolation: "isolate" } }}
      tabIndex={0}
      height="auto"
      column={12}
      // position="fixed"
    >
      <Sticky top={0} zIndex={STICKY_ZINDEX}>
        <Navigation />
      </Sticky>
      <Box
        width="100%"
        borderStyle="lg"
        display="flex"
        justifyContent="center"
        paddingY={0}
        paddingX={0}
      >
        {/* <Box
          overflow="hidden"
          width="30%"
          maxHeight={200}
          padding={2}
          tabIndex={0}
          paddingY={12}
          borderStyle="sm"
        > */}

        <Box
          overflow="visible"
          paddingX={5}
          paddingY={5}
          smDisplay="none"
          mdDisplay="none"
          lgDisplay="flex"
          height="100%"
          width="40%"
          display={isSmallScreen ? "none" : "flex"}
        >
          <EventBoard events={events} />
        </Box>
        {/* </Box> */}
        <Box
          overflow="scrollY"
          width="100%"
          maxHeight="100vh"
          // padding={12}
          tabIndex={0}
          borderStyle="sm"
        >
          <Box
            // paddingX={5}
            paddingY={5}
            flex="grow"
            // mdPaddingX={2}
            mdMarginEnd={2}
            mdMarginStart={2}
            smPaddingX={2}
            smMarginEnd={2}
            smMarginStart={12}
          >
            <CreatePost />
            <Box paddingY={0}>
              {posts.map((post, index) => (
                <Box key={index} paddingY={3}>
                  <PostView
                    profilePhoto={post.profilePhoto}
                    eventTitle={post.eventTitle}
                    eventDate={post.eventDate}
                    eventTime={post.eventTime}
                    eventLocation={post.eventLocation}
                    username={post.username}
                    moment={post.moment}
                    postText={post.postText}
                    media={post.media}
                    lastLikeUser={post.lastLikeUser}
                    likesCount={post.likesCount}
                    recentComment={post.recentComment}
                    comments={post.comments}
                    commentsCount={post.commentsCount}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        {/* <Box
          overflow="hidden"
          width="30%"
          maxHeight={200}
          padding={2}
          tabIndex={0}
          borderStyle="sm"
        > */}
        <Box
          overflow="scroll"
          paddingX={5}
          width="40%"
          paddingY={5}
          smDisplay="none"
          mdDisplay="none"
          lgDisplay="flex"
          display={isSmallScreen ? "none" : "flex"}
        >
          <Flex direction="column" gap={3}>
            <SideMenu
              username="John Doe"
              fansCount={5000}
              userPhoto="user_photo.jpg"
            />
            <SuggestionBoard suggestions={suggestions} />
            <Box
              display="flex"
              direction="row"
              justifyContent="center"
              alignContent="center"
              alignItems="center"
              alignSelf="center"
            >
              <Box
                height={20}
                width={110}
                alignItems="center"
                justifyContent="center"
                alignContent="center"
                style={logoStyle}
                marginTop={1}
              >
                <Image
                  alt="Logo"
                  src="../logo.png"
                  fit="contain"
                  naturalHeight={1}
                  naturalWidth={1}
                />
              </Box>
              <div>© 2023. Tout droit réservé</div>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
    // </Box>
  );
};

export default Explorer;
