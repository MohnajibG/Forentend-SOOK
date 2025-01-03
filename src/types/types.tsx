import { ReactNode } from "react";

export interface UserContextType {
  userId: string | null;
  token: string | null;
  username: string | null;
  setUser: (userId: string, token: string, username: string) => void;
  logout: () => void;
}

export interface OfferProps {
  account: ReactNode;
  _id: string;
  title: string;
  description: string;
  price: number;
  pictures: string[];
  userId: {
    username: string; // En supposant que le username est peuplé
    avatar: string;
  };
}

export interface Account {
  username: string;
  account: Account;

  address: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  sexe: string | null;
  dateOfBorn: string | null;
  avatar: string | null;
}

export interface UserProfile {
  account: Account;
  createdAt: string;
  email: string;
  hash: string;
  newsletter: boolean;
  salt: string;
  token: string;
  updatedAt: string;
  _id: string;
}

export type FormDataType = {
  pictures: unknown[];
  title: string;
  description: string;
  price: string;
  condition: string;
  city: string;
  brand: string;
  size: string;
  color: string;
};

export interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

export interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchResults: React.Dispatch<React.SetStateAction<OfferProps[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
