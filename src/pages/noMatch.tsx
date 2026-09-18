import React from "react";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

const NoMatch: React.FC = () => {
  usePageTitle("Page introuvable");
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(160deg, var(--color-sook-marron) 0%, var(--color-sook-marron-dark) 100%)",
      }}
    >
      <div className="glass-gold text-center space-y-5 px-10 py-12 max-w-sm">
        <p className="text-6xl font-bold text-white/90">404</p>
        <h1 className="text-2xl font-bold">Page introuvable</h1>
        <p className="text-sm text-white/80">
          Oups ! La page que vous cherchez n'existe pas ou plus.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary px-6 py-3">
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NoMatch;
