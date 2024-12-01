import React from "react";
import "../styles/Footer.css";
import { FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="simple-footer">
      <p>
        Réalisé par <span>Najib</span> - Retrouvez mon travail sur{" "}
        <a
          href="https://github.com/MohnajibG"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <FaGithub className="github-icon" /> GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
