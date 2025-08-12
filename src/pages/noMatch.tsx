import React from "react";
import { useNavigate } from "react-router-dom";

const NoMatch: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-800">404 NOT FOUND</h1>
        <p className="text-lg text-gray-600">
          Oups ! La page que vous recherchez n'existe pas.
        </p>
        <button
          onClick={() => navigate("/")}
          className="
            px-6 py-3 text-white font-bold rounded-md
            bg-[#dfa080bd] hover:bg-[#c87660]
            transition-colors
          "
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NoMatch;
