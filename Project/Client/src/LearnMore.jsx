import React from "react";
import styles from "./LearnMore.module.css";

export default function LearnMore() {
  return (
    <div className={styles.lmBg}>
      {/* Header */}
      <header className={styles.lmHeader}>
        <div className={styles.lmLogo}>
          <i className={`fas fa-seedling ${styles.lmLogoIcon}`}></i> GrainZillow
        </div>
        <nav className={styles.lmNavLinks}>
          <a href="/" className={styles.lmNavLink}>Home</a>
          <a href="#features" className={styles.lmNavLink}>Features</a>
          <a href="#how" className={styles.lmNavLink}>How It Works</a>
          <a href="#benefits" className={styles.lmNavLink}>Benefits</a>
        </nav>
      </header>

      {/* Introduction */}
      <section className={styles.lmSection}>
        <h1 className={styles.lmSectionH1}>Learn More About GrainZillow</h1>
        <p className={styles.lmSectionP}>
          GrainZillow is an IoT-based intelligent system that monitors and maintains the health of grain storage silos in real-time. It combines sensors, embedded technology, and smart web dashboards to ensure that stored grains are kept in safe conditions — protecting farmers from financial losses and ensuring food security.
        </p>
      </section>

      {/* Features */}
      <section id="features" className={styles.lmSection}>
        <h1 className={styles.lmSectionH1}>Key Features</h1>
        <div className={styles.lmFeatures}>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-thermometer-half ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Temperature &amp; Humidity Monitoring</h3>
            <p className={styles.lmFeatureCardP}>Real-time data from LM35 and DHT sensors ensure ideal grain storage conditions.</p>
          </div>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-wind ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Automatic Fan Control</h3>
            <p className={styles.lmFeatureCardP}>Smart system activates fans to maintain safe temperature and humidity levels automatically.</p>
          </div>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-bell ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Instant Alerts</h3>
            <p className={styles.lmFeatureCardP}>Alerts via dashboard for dangerous gas or temperature levels, preventing damage early.</p>
          </div>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-database ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Data Storage &amp; Analysis</h3>
            <p className={styles.lmFeatureCardP}>Each reading is stored in the database for future insights, analytics, and traceability.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className={`${styles.lmSection} ${styles.lmHowItWorks}`}>
        <h1 className={styles.lmSectionH1}>How It Works</h1>
        <div className={styles.lmSteps}>
          <div className={styles.lmStep}>
            <i className={`fas fa-satellite-dish ${styles.lmStepIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Step 1</h3>
            <p className={styles.lmFeatureCardP}>Sensors installed in silos continuously collect temperature, humidity, and gas data.</p>
          </div>
          <div className={styles.lmStep}>
            <i className={`fas fa-microchip ${styles.lmStepIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Step 2</h3>
            <p className={styles.lmFeatureCardP}>Data is processed through an Arduino-based system and transmitted to the cloud.</p>
          </div>
          <div className={styles.lmStep}>
            <i className={`fas fa-laptop-code ${styles.lmStepIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Step 3</h3>
            <p className={styles.lmFeatureCardP}>The web dashboard displays readings visually with color-coded gauges and alerts.</p>
          </div>
          <div className={styles.lmStep}>
            <i className={`fas fa-fan ${styles.lmStepIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Step 4</h3>
            <p className={styles.lmFeatureCardP}>Automatic control activates cooling fans or alerts the manager to take preventive action.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className={`${styles.lmSection} ${styles.lmBenefits}`}>
        <h1 className={styles.lmSectionH1}>Why Choose GrainZillow?</h1>
        <p className={styles.lmSectionP}>
          GrainZillow bridges the gap between technology and agriculture, helping farmers and managers reduce grain losses and improve productivity.
        </p>
        <div className={styles.lmFeatures}>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-shield-alt ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Prevents Spoilage</h3>
            <p className={styles.lmFeatureCardP}>Reduces losses caused by moisture, pests, and gas buildup in silos.</p>
          </div>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-chart-line ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Data-Driven Insights</h3>
            <p className={styles.lmFeatureCardP}>Helps in analyzing storage conditions for better planning and management.</p>
          </div>
          <div className={styles.lmFeatureCard}>
            <i className={`fas fa-user-shield ${styles.lmFeatureCardIcon}`}></i>
            <h3 className={styles.lmFeatureCardH3}>Secure Access</h3>
            <p className={styles.lmFeatureCardP}>Unique user IDs ensure silo data privacy and individual management.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.lmFooter}>
        © 2025 GrainZillow | Smart Storage System. All Rights Reserved.
      </footer>
    </div>
  );
}
