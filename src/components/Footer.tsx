import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer
      className="
      fixed inset-x-0 bottom-0
      h-[10vh]
      bg-gray-900
      text-gray-300
      font-[Space Grotesk]
      shadow-[0_-2px_5px_rgba(0,0,0,0.3)]
      z-50
    "
    >
      <div className="h-full container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-2 text-center">
        <p className="text-sm md:text-base">
          Réalisé par <span className="font-bold text-[#dfa080bd]">Najib</span>{" "}
          — Retrouvez mon travail sur&nbsp;
        </p>
        <a
          href="https://github.com/MohnajibG"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2
            text-[#dfa080bd]
            hover:text-[#c87660]
            transition-colors
          "
        >
          <FaGithub className="text-xl transition-transform hover:scale-110" />
          <span className="text-sm md:text-base font-bold">GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
