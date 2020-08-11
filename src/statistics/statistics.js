import React from "react";
import styles from "./statistics.module.css";
import PropTypes from "prop-types";

export const Statistics = ({ statistiks }) => {
  return (
    <section className={styles.statistiks__container}>
      <h2 className={styles.statistiks__title}>Upload stats</h2>
      <ul className={styles.statistiks__star_list}>
        {statistiks.map((statistik) => (
          <li className={styles.statistiks__item}>
            <span className={styles.statistiks__label}>{statistik.label}</span>
            <span className={styles.statistiks__percentage}>
              {statistik.percentage}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

Statistics.propTypes = {
  label: PropTypes.string.isRequired,
  percentage: PropTypes.number.isRequired,
};
