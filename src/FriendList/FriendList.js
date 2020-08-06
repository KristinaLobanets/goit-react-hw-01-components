import React from "react";

export const FriendListFunk = ({ friend }) => {
  return (
    <ul class="friend-list">
      {friend.map((item) => (
        <li class="item">
          <span class="status">{item.isOnline}</span>
          <img class="avatar" src={item.avatar} alt={item.id} width="48" />
          <p class="name">{item.name}</p>{" "}
        </li>
      ))}
    </ul>
  );
};
