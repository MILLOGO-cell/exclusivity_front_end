import React from "react";
import styles from "../app/Modal.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons"; // Importez l'icône de validation et l'icône en forme de croix (X)
import CustomButton from "./NickButton";

const ModalSubscription = ({
  suggestionId,
  userImage,
  userName,
  onClose,
  onFollow,
}) => {
  const handleFollow = () => {
    onFollow();
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />
        </button>
        <div className={styles.userInfo}>
          <Image
            src={userImage || "/user1.png"}
            alt={`Photo de profil de ${userName}`}
            style={{ borderRadius: 50 }}
            width={64}
            height={64}
            unoptimized
          />
          <div className={styles.username}>{userName}</div>
        </div>
        <p className={styles.modalText}>Voulez-vous suivre {userName} ?</p>
        <div className={styles.advantagesList}>
          <ul>
            <li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ color: "green" }}
              />{" "}
              Accès complet au contenu de {userName}
            </li>
            <li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ color: "green" }}
              />{" "}
              Vous pouvez annuler votre abonnement à tout moment
            </li>
          </ul>
        </div>

        <div className={styles.buttonGroup}>
          <CustomButton
            text={"Suivre"}
            buttonColor="blue"
            type="submit"
            rounded
            fullWidth={true}
            onClick={handleFollow}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalSubscription;
