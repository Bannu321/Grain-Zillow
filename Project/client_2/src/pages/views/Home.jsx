import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import AboutUsSlider from "./AboutUsSlider";
import NavBar from "./NavBar";

export default function Home() {
  return (
    <div className={styles.homeBg}>
      {/* <header className={styles.header}>
        <div className={styles.logo}>
          <i className="fas fa-seedling"></i> GrainZillow
        </div>
        <div className={styles.navLinks}>
          <a href="/">Home</a>
          <a href="/problem">Problem</a>
          <a href="/about">About Us</a>
          <Link to="/login">Login</Link>
        </div>
      </header> */}
      <NavBar />

      <div className={styles.main}>
        <h1>Smart Grain Storage & Monitoring System</h1>
        <p>
          GrainZillow ensures safe, real-time monitoring of temperature,
          humidity, and gas levels inside grain silos, with remote control
          capabilities. Empowering warehouse managers and farmers with
          intelligent, connected storage.
        </p>
        <div className={styles.buttons}>
          <Link to="/login">
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</button>
          </Link>
          <Link to="/learn-more">
            <button className={`${styles.btn} ${styles.btnOutline}`}>Learn More</button>
          </Link>
        </div>
      </div>

      {/* Problem Section */}
      <section id="problem" className={styles.infoSection}>
        <div className={styles.infoText}>
          <h2>The Problem</h2>
          <p>
            Every year, India loses millions of tons of grains due to poor storage conditions such as excessive humidity, temperature fluctuations, and lack of monitoring. These issues not only cause economic losses but also lead to food wastage and farmer distress.
          </p>
        </div>
        <img
          src="problem_1.jpg"
          alt="Grain Loss Problem"
          className={styles.infoImg}
        />
      </section>

      {/* Impact in India Section */}
      <section className={styles.infoSection} style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <img
          src="problem_3.jpg"
          alt="Impact in India"
          className={styles.infoImg}
        />
        <div className={styles.infoText}>
          <h2>Impact in India</h2>
          <p>
            With agriculture being the backbone of India's economy, grain loss affects millions of farmers. It impacts food prices, national reserves, and overall rural livelihood. Proper monitoring and storage infrastructure can significantly reduce these losses.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.infoSection}>
        <div className={styles.infoText}>
          <h2>How GrainZillow Solves It</h2>
          <p>
            GrainZillow provides a smart IoT-based system that monitors temperature, humidity, and gas emissions in real-time. Automated alerts and remote control of devices like fans and dehumidifiers help maintain optimal grain storage conditions and prevent spoilage.
          </p>
        </div>
        <img
          src="problem_2.jpg"
          alt="Smart Storage Solution"
          className={styles.infoImg}
        />
      </section>

      {/* About Us Slider */}
      <AboutUsSlider />

      <footer className={styles.footer}>
        © 2025 GrainZillow. All Rights Reserved.
      </footer>
    </div>
  );
}
