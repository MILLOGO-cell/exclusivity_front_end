import React from "react";
import { Box, Flex, Image, Text, Video } from "gestalt";

const Post = ({ username, timestamp, content, mediaUrl, mediaType }) => {
  return (
    <Flex
      width="100%"
      height="100%"
      justifyContent="center"
      alignSelf="center"
      alignContent="center"
      alignItems="center"
    >
      <Box
        height="100%"
        width={1000}
        alignSelf="center"
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        marginTop={2}
        color="default"
        padding={5}
        marginBottom={10}
      >
        <Box display="flex" direction="row" justifyContent="between">
          <Box>
            <Text size="400" weight="bold">
              {username}
            </Text>
            <Text> @{username}</Text>
          </Box>
          <Box>il y'a {timestamp}</Box>
        </Box>
        <Box marginTop={12}>
          <Text>{content}</Text>
          {mediaType === "image" && mediaUrl && (
            <Box height={900} marginTop={2}>
              <Image
                alt="Photo"
                naturalWidth={1}
                naturalHeight={1}
                src={mediaUrl}
                fit="cover"
              />
            </Box>
          )}
          {mediaType === "video" && mediaUrl && (
            <Box height={510} marginTop={2}>
              <Video src={mediaUrl} width="100%" height="100%" controls />
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Post;
