export interface UserContextType {
  userId: string | null;
  token: string | null;
  username: string | null;
  setUser: (userId: string, token: string, username: string) => void;
  logout: () => void;
}
export interface HeaderProps {
  token: string | null;
  logout: () => void;
}
