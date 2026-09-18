import { Link, useLocation } from "react-router-dom";

interface NavProps {
  userId?: string;
  onLinkClick?: () => void;
  className?: string;
}

const navItems = (userId?: string) => [
  { to: `/profilePage/${userId}`, label: "Profil" },
  { to: "/home", label: "Accueil" },
  { to: "/offers", label: "Offres" },
  { to: "/mesoffres", label: "Mes annonces" },
  { to: "/publish", label: "Publier" },
];

export default function Nav({ userId, onLinkClick, className = "" }: NavProps) {
  const { pathname } = useLocation();

  return (
    <ul className={`hidden lg:flex flex-row items-center gap-0.5 ${className}`}>
      {navItems(userId).map((item) => {
        const isActive = pathname === item.to;
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onLinkClick}
              className={`
                px-3 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-colors
                ${
                  isActive
                    ? "bg-sook-accent-hover shadow-2xl text-white"
                    : "text-[#4a2c1d] hover:bg-white/30"
                }
              `}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
