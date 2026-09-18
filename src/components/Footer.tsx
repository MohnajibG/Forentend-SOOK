import { Link } from "react-router-dom";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineSparkles } from "react-icons/hi2";

import logo from "../assets/img/LOGO2.png";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="w-full text-white/70"
      style={{ background: "var(--color-sook-marron-dark)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Marque */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link
            to="/home"
            className="flex items-center gap-3 text-xl font-bold text-white mb-3"
          >
            <img
              src={logo}
              alt="Logo SOOK"
              className="h-10 w-10 rounded-full object-cover"
            />
            SOOK
          </Link>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            Le marché de la seconde main entre particuliers : achetez et
            revendez vêtements, chaussures et accessoires à petit prix, près de
            chez vous.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://github.com/MohnajibG"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de Najib"
              className="text-white/60 hover:text-sook-accent transition-colors"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram SOOK"
              className="text-white/60 hover:text-sook-accent transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Explorer */}
        <nav aria-label="Explorer">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Explorer
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/home"
                className="hover:text-sook-accent transition-colors"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                to="/offers"
                className="hover:text-sook-accent transition-colors"
              >
                Toutes les offres
              </Link>
            </li>
            <li>
              <Link
                to="/publish"
                className="hover:text-sook-accent transition-colors"
              >
                Publier une annonce
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mon compte */}
        <nav aria-label="Mon compte">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Mon compte
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/mesoffres"
                className="hover:text-sook-accent transition-colors"
              >
                Mes annonces
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="hover:text-sook-accent transition-colors"
              >
                Mon panier
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-sook-accent transition-colors"
              >
                Se connecter
              </Link>
            </li>
          </ul>
        </nav>

        {/* Confiance */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            Pourquoi SOOK
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <HiOutlineShieldCheck
                className="mt-0.5 shrink-0 text-sook-accent"
                size={18}
              />
              Paiement sécurisé via Stripe
            </li>
            <li className="flex items-start gap-2">
              <HiOutlineSparkles
                className="mt-0.5 shrink-0 text-sook-accent"
                size={18}
              />
              Des articles vérifiés, entre particuliers
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-6 text-center text-xs text-white/50">
        © {year} SOOK — Réalisé par{" "}
        <span className="font-semibold text-sook-accent">Najib</span>. Tous
        droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
