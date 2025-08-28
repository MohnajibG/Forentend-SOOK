import { Link } from "react-router-dom";

interface NavProps {
  userId?: string;
  onLinkClick?: () => void;
  className?: string;
}

const navItems = (userId?: string) => [
  { to: `/profilePage/${userId}`, label: "Profil" },
  { to: "/home", label: "Accueil" },
  { to: "/offers", label: "Offres" },
  { to: "/mesoffres", label: "Mes Offres" },
  { to: "/publish", label: "Publier" },
  { to: `/cart/${userId}`, label: "Panier" },
];

export default function Nav({ userId, onLinkClick, className = "" }: NavProps) {
  return (
    <ul className={`hidden md:flex flex-row gap-6 items-center ${className}`}>
      {navItems(userId).map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            onClick={onLinkClick}
            className="px-4 py-2 text-white hover:text-yellow-300 transition-colors"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
