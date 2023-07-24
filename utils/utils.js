const formatMomentText = (timestamp) => {
  const now = new Date().getTime();
  const timeDifference = now - timestamp;

  if (timeDifference < 60000) {
    // Moins d'une minute
    return "maintenant";
  } else if (timeDifference < 3600000) {
    // Moins d'une heure
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (timeDifference < 86400000) {
    // Moins d'un jour (24 heures)
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (timeDifference < 604800000) {
    // Moins d'une semaine (7 jours)
    const days = Math.floor(timeDifference / 86400000);
    return `${days} jour${days > 1 ? "s" : ""}`;
  } else if (timeDifference < 2592000000) {
    // Moins d'un mois (30 jours)
    const weeks = Math.floor(timeDifference / 604800000);
    return `${weeks} semaine${weeks > 1 ? "s" : ""}`;
  } else if (timeDifference < 31536000000) {
    // Moins d'une année (365 jours)
    const months = Math.floor(timeDifference / 2592000000);
    return `${months} mois`;
  } else {
    // Plus d'une année
    const years = Math.floor(timeDifference / 31536000000);
    return `${years} an${years > 1 ? "s" : ""}`;
  }
};
export default formatMomentText;
