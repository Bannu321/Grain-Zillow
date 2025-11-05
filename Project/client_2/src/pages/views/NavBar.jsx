import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const NavBar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <i className="fas fa-seedling"></i> GrainZillow
      </div>
      <div className={styles.navLinks}>
        <a href="/">Home</a>
        <a href="/problem">Problem</a>
        <a href="/contactus">Contact Us</a>
        <Link to="/login">Login</Link>
      </div>
    </header>
  );
};

export default NavBar;
