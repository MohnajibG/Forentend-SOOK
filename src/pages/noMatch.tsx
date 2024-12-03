import { useNavigate } from "react-router-dom";
import "../assets/styles/noMatch.css";

const NoMatch = () => {
  const navigate = useNavigate(); // Appeler le hook useNavigate
  return (
    <div className="NoMatch">
      <h1>404 NOT FOND</h1>
      <button className="btn-nomatch" onClick={() => navigate("/")}>
        Accueil
      </button>
    </div>
  );
};

export default NoMatch;
