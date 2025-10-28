import React from "react";
import styles from "./ProblemSection.module.css";
import { Link } from "react-router-dom";
export default function ProblemSection() {
  return (
    <section id="problem" className={styles.problemSection}>
      <h1 className={styles.heading}>The Problem We Are Solving</h1>

      <p className={styles.description}>
        Every year, thousands of tons of grains stored across India are lost due to poor storage
        conditions. The excessive <b>heat, humidity, and gas accumulation</b> inside grain silos often lead to
        <b>spontaneous combustion</b> and spoilage. Farmers and storage operators face massive financial losses,
        and the nation’s food security is at risk.
      </p>

      <div className={styles.cardsContainer}>
        <div className={styles.card} tabIndex={0}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4814/4814756.png"
            alt="Spoilage Icon"
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>Grain Spoilage</h3>
          <p className={styles.cardDescription}>
            Due to uncontrolled temperature and humidity, stored grains rot and lose quality rapidly.
          </p>
        </div>

        <div className={styles.card} tabIndex={0}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1048/1048947.png"
            alt="Loss Icon"
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>Economic Loss</h3>
          <p className={styles.cardDescription}>
            Farmers and warehouse operators face up to <b>30–40% grain loss</b> annually due to inefficient monitoring.
          </p>
        </div>

        <div className={styles.card} tabIndex={0}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/889/889823.png"
            alt="Fire Icon"
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>Spontaneous Combustion</h3>
          <p className={styles.cardDescription}>
            Gas accumulation like <b>CO₂ or methane</b> increases internal heat and pressure, often leading to fire incidents.
          </p>
        </div>
      </div>

      <p className={styles.footerText}>
        This is where <b>GrainZillow</b> steps in — a smart, IoT-powered solution that constantly monitors 
        temperature, humidity, and gas levels, automatically alerts managers, and activates preventive actions 
        to protect stored grains and the livelihoods that depend on them.
      </p>

      <div className={styles.backButtonContainer}>
        <a href="/" className={styles.backButton}>
          Back to Home Page
        </a>
      </div>
    </section>
  );
}
