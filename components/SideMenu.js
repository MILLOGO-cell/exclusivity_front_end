import { Box, Avatar, Text, Button } from "gestalt";
import "@/app/globals.css";
import IconButton from "./IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

const SideMenu = ({ username, fansCount, userPhoto }) => {
  return (
    <Box padding={4} width={310} rounding={5} color="default">
      <Box marginBottom={4} display="flex" alignItems="center">
        <Avatar src={userPhoto} name="User Photo" size="md" />
        <Box marginLeft={2} paddingX={2}>
          <Text bold>{username}</Text>
          <Text color="gray" size="sm">
            {fansCount} fans
          </Text>
        </Box>
      </Box>
      <Box marginBottom={2}>
        <Box marginBottom={2}>
          <IconButton
            icon={<FontAwesomeIcon icon={faUser} />}
            label="Mon profil"
            buttonColor="white"
            textColor="black"
            iconColor="black"
            iconPosition="left"
            href="/profil"
          />
        </Box>
        <IconButton
          icon={<FontAwesomeIcon icon={faSignOut} />}
          label="Déconnexion"
          buttonColor="white"
          textColor="red"
          iconColor="red"
          iconPosition="left"
        />
      </Box>

      <Box marginBottom={2}>
        <IconButton
          icon={<FontAwesomeIcon icon={faPlus} />}
          label="Nouvelle publication"
          buttonColor="blue"
          textColor="white"
          iconColor="white"
          iconPosition="left"
        />
      </Box>
    </Box>
  );
};

export default SideMenu;
