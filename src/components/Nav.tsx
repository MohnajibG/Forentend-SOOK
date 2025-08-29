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
    <ul
      className={`hidden md:flex flex-row items-center gap-6 px-6 py-3 
    ${className}`}
    >
      {navItems(userId).map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            onClick={onLinkClick}
            className="
              relative px-3 py-2 font-semibold text-white  text-lg
              transition-colors duration-300
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-0 after:h-[2px] after:bg-white
              after:transition-all after:duration-500
              hover:after:w-full
            "
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
