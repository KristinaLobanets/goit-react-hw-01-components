import React from "react";
import styles from "./FriendList.module.css";
import PropTypes from "prop-types";

export const FriendListFunk = ({ friend }) => {
  return (
    <ul className={styles.friend_list__container}>
      {friend.map((item) => (
        <li className={styles.friend_list__item}>
          <span className={styles.friend_list__status}>{item.isOnline}</span>
          <img
            className={styles.friend_list__avatar}
            src={item.avatar}
            alt={item.id}
            width="68"
          />
          <p className={styles.friend_list__name}>{item.name}</p>{" "}
        </li>
      ))}
    </ul>
  );
};

FriendListFunk.propTypes = {
  id: PropTypes.number.isRequired,
  isOnline: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
};
