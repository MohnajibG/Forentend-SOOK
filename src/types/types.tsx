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
  address: string | null;
  email: string | null;
  avatar: string | null;
  country: string | null;
  dateOfBorn: string | null;
  phoneNumber: string | null;
  sexe: string | null;
  username: string | null;
  postalCode: string | null;
}

export interface UserProfile {
  account: Account | null;
  newsletter: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  _id: string | null;
}
