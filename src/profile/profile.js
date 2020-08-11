import React from "react";
import styles from "./profile.module.css";
import PropTypes from "prop-types";

export const Profile = ({ user }) => {
  const { name, tag, location, avatar, stats } = user;
  const { followers, likes, views } = stats;
  return (
    <div className={styles.profile__container}>
      <div className={styles.profile__txt}>
        <img src={avatar} alt="user avatar" className={styles.profile__photo} />
        <p className={styles.profile__name}>{name}</p>
        <p className={styles.profile__tag}>{tag}</p>
        <p className={styles.profile__location}>{location}</p>
      </div>

      <ul className={styles.profile__tab}>
        <li className={styles.profile__tab__block}>
          <span className={styles.profile__tab__label}>Followers</span>
          <span className={styles.profile__tab__quantity}>{followers}</span>
        </li>
        <li className={styles.profile__tab__block}>
          <span className={styles.profile__tab__label}>Views</span>
          <span className={styles.profile__tab__quantity}>{views}</span>
        </li>
        <li className={styles.profile__tab__block}>
          <span className={styles.profile__tab__label}>Likes</span>
          <span className={styles.profile__tab__quantity}>{likes}</span>
        </li>
      </ul>
    </div>
  );
};

Profile.propTypes = {
  name: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  followers: PropTypes.number.isRequired,
  likes: PropTypes.number.isRequired,
  views: PropTypes.number.isRequired,
};
