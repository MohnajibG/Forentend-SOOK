// ==============================
// User & Authentication Types
// ==============================
export interface UserContextType {
  userId: string | null;
  token: string | null;
  username: string | null;
  setUser: (userId: string, token: string, username: string) => void;
  logout: () => void;
}

export interface AuthContextType {
  isAuth: boolean;
  setIsAuth: (value: boolean) => void;
}

export interface UserProfile {
  _id: string;
  createdAt: string;
  email: string;
  hash: string;
  newsletter: boolean;
  salt: string;
  token: string;
  updatedAt: string;
}

// ==============================
// Offer & Product Types
// ==============================
export interface ProfilProps {
  _id?: string | null;
  title: string | null;
  description: string | null;
  price: number | null;
  condition: string | null;
  pictures: string[] | null;
  city: string | null;
  brand: string | null;
  color: string | null;
  size: string | null;
  account?: {
    userId: string;
    username: string;
    address: string | null;
    postalCode: string | null;
    country: string | null;
    phoneNumber: string | null;
    sexe: string | null;
    dateOfBorn: string | null;
    avatar?: string | null;
  };
}

// ==============================
// Cart Types
// ==============================
export interface CartItem {
  id: string; // ID unique du produit
  name: string; // Nom du produit
  price: number; // Prix unitaire
  quantity: number; // Quantité dans le panier
}

// ==============================
// UI & Component Props
// ==============================
export interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

export interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResults: React.Dispatch<React.SetStateAction<ProfilProps[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define and export the Account type

export interface Account {
  account: {
    username: string;

    address: string;

    postalCode: string;

    country: string;

    phoneNumber: string;

    sexe: string;

    dateOfBorn: string;
  };
}
