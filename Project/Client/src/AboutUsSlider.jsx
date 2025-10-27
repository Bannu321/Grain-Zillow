import React, { useState, useEffect } from "react";
import styles from "./AboutUsSlider.module.css";

// Array of your team members
const members = [
  {
    img: "Amir.jpg",
    name: "Syed Ameer Basha",
    desc: "Team Lead & Frontend Developer – Responsible for IoT integration, system architecture, and project coordination for GrainZillow."
  },
  {
    img: "Jaswanth.jpg",
    name: "Talluri Jaswanth",
    desc: "Backend Developer – Focused on database management, data flow logic, and cloud connectivity."
  },
  {
    img: "HimaSai.jpg",
    name: "Talari Hima Sai",
    desc: "Frontend Developer & IoT Specialist– Designed and implemented user-friendly web interfaces and responsive dashboards.\nWorked on ESP32 hardware interfacing, sensors, and real-time monitoring systems."
  },
  {
    img: "Sekhar.jpg",
    name: "Vuddanti Dhana Sekhar",
    desc: "Database Manager – Oversees the design, implementation, and maintenance of the database systems, ensuring data integrity, security, and efficient access for the GrainZillow platform."
  },
  {
    img: "Akhil.jpg",
    name: "Boddu Akhil ",
    desc: "Data Analyst – Responsible for analyzing environmental data trends and visualization in GrainZillow dashboard."
  }
];

export default function AboutUsSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % members.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className={styles.aboutSection}>
      <h2>Meet Our Team</h2>
      <div className={styles.sliderWrapper}>
        {members.map((m, idx) => (
          <div
            key={m.name}
            className={`${styles.aboutCard} ${idx === current ? styles.active : ""}`}
          >
            <img src={m.img} alt={m.name} className={styles.aboutImg} />
            <h3>{m.name}</h3>
            <p style={{whiteSpace: "pre-line"}}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
