import React from "react";
import { Link } from "react-router-dom";
import styles from "./AboutSection.module.css";
import NavBar from "./NavBar";

export default function AboutSection() {
  return (
    <>
    <NavBar />
    <section id="about" className={styles.aboutSection}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.description}>
        We are a team of passionate engineers from VIT-AP University, working together to build <b>GrainZillow</b> — 
        an IoT-based Smart Grain Storage Monitoring System designed to prevent spontaneous combustion 
        and ensure safe, efficient storage for farmers across India.
      </p>

      <div id="team-container" className={styles.teamContainer}>
        <div className={styles.teamMember}>
          <img
            src="Amir.jpg"
            alt="Syed Ameer Basha"
            className={styles.memberImage}
          />
          <h3 className={styles.memberName}>Syed Ameer Basha</h3>
          <p className={styles.memberRole}> Team Lead & Frontend Developer</p>
          <p className={styles.memberDescription}>Responsible for IoT integration, system architecture, and project coordination for GrainZillow.</p>
        </div>

        <div className={styles.teamMember}>
          <img
            src="Jaswanth.jpg"
            alt="Talluri Jaswanth"
            className={styles.memberImage}
          />
          <h3 className={styles.memberName}>Talluri Jaswanth</h3>
          <p className={styles.memberRole}>Backend Developer</p>
          <p className={styles.memberDescription}>Building secure and scalable backend logic for device integration, Managing API requests , Frontend - Backend Smooth integration.</p>
        </div>

        <div className={styles.teamMember}>
          <img
            src="HimaSai.jpg"
            alt="Talari Hima Sai"
            className={styles.memberImage}
          />
          <h3 className={styles.memberName}>Talari Hima Sai</h3>
          <p className={styles.memberRole}>Frontend Developer & Hardware Engineer</p>
          <p className={styles.memberDescription}>Developing embedded systems for real-time data acquisition and designing modern and responsive UIs.</p>
        </div>

        <div className={styles.teamMember}>
          <img
            src="Sekhar.jpg"
            className={styles.memberImage}
          />
          <h3 className={styles.memberName}>Vuddanti Dhana Sekhar</h3>
          <p className={styles.memberRole}>Database Specialist</p>
          <p className={styles.memberDescription}>Managing efficient data storage and retrieval for analytics.</p>
        </div>

        <div className={styles.teamMember}>
          <img
            src="Akhil.jpg"
            alt="Akhil Boddu"
            className={styles.memberImage}
          />
          <h3 className={styles.memberName}>Boddu Akhil</h3>
          <p className={styles.memberRole}>Data Analyst</p>
          <p className={styles.memberDescription}>Responsible for analyzing environmental data trends and visualization in GrainZillow dashboard.</p>
        </div>
      </div>

      <div className={styles.backButtonContainer}>
        <a href="/" className={styles.backButton}>
          Back to Home Page
        </a>
      </div>
    </section>
    </>
  );
}
