export interface UserContextType {
  userId: string | null;
  token: string | null;
  username: string | null;
  setUser: (userId: string, token: string, username: string) => void;
  logout: () => void;
}

export interface OfferProps {
  title: string | null;
  price: number | null;
}

export interface Account {
  username: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  sexe: string | null;
  dateOfBorn: string | null;
  address: string | null;
  postalCode: string | null;
  country: string | null;
}

export interface UserProfile {
  email: string | null;
  account: Account | null;
  newsletter: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  _id: string | null;
}
