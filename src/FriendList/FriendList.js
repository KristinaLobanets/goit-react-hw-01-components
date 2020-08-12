import React from "react";
import styles from "./FriendList.module.css";
import PropTypes from "prop-types";

export const FriendListFunk = ({ friend }) => {
  return (
    <ul className={styles.friend_list__container}>
      {friend.map((item) => (
        <li key={item.id} className={styles.friend_list__item}>
          {item.isOnline ? (
            <span className={styles.friend_list__status_on}></span>
          ) : (
            <span className={styles.friend_list__status_off}></span>
          )}
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
  id: PropTypes.number,
  isOnline: PropTypes.bool,
  name: PropTypes.string,
  avatar: PropTypes.string,
};
