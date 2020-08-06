import React from "react";

export const Statistics = ({ statistiks }) => {
  return (
    <section class="statistics">
      <h2 class="title">Upload stats</h2>
      <ul class="stat-list">
        {statistiks.map((statistik) => (
          <li class="item">
            <span class="label">{statistik.label}</span>
            <span class="percentage">{statistik.percentage}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
