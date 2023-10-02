import React from "react";
import styles from "../app/Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "./NickButton";

const ModalCreator = ({ Id, onClose }) => {
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

        <p className={styles.modalText}>Voulez-vous devenir un créateur ?</p>
        <div className={styles.advantagesList}>
          <ul>
            <li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ color: "green" }}
              />{" "}
              Création de contenus.
            </li>
            <li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ color: "green" }}
              />{" "}
              Gagnez de l'argent grâce à vos contenus.
            </li>
            <li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ color: "green" }}
              />{" "}
              Vous pouvez annuler votre abonnement à tout moment.
            </li>
          </ul>
        </div>

        <div className={styles.buttonGroup}>
          <CustomButton
            text={"Devenir créateur"}
            buttonColor="blue"
            type="submit"
            rounded
            fullWidth={true}
            // onClick={handleFollow}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalCreator;
