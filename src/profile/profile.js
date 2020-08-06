import React from "react";
import styles from "./profile.module.css";

export const Profile = ({ user }) => {
  const { name, tag, location, avatar, stats } = user;
  const { followers, likes, views } = stats;
  return (
    <div class={styles}>
      <div class="description">
        <img src={avatar} alt="user avatar" class="avatar" />
        <p class="name">{name}</p>
        <p class="tag">{tag}</p>
        <p class="location">{location}</p>
      </div>

      <ul class="stats">
        <li>
          <span class="label">Followers</span>
          <span class="quantity">{followers}</span>
        </li>
        <li>
          <span class="label">Views</span>
          <span class="quantity">{views}</span>
        </li>
        <li>
          <span class="label">Likes</span>
          <span class="quantity">{likes}</span>
        </li>
      </ul>
    </div>
  );
};
