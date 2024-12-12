import userContext from "../../contexts/UserContext";
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};
