import { useState, useEffect } from "react";
import axios from "axios";

const useUserInfo = (userId: string | null, token: string | null) => {
  const [userInfo, setUserInfo] = useState<{
    account: any;
    username: string | null;
    avatar: string | null;
  }>({
    account: null,
    username: null,
    avatar: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userId && token) {
        try {
          const response = await axios.get(
            `https://site--sook--dnxhn8mdblq5.code.run/user/profile/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserInfo(response.data);
        } catch (err) {
          console.error(
            "Erreur lors de la récupération des infos utilisateur:",
            err
          );
        }
      }
    };

    fetchUserInfo();
  }, [userId, token]);

  return { userInfo };
};
export default useUserInfo;
