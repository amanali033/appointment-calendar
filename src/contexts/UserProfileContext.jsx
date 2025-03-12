import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createAPIEndPointAuth } from "../config/api/apiAuth";
import { getUserData } from "../utils";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const userData = getUserData();
  const userId = userData?.id ?? null;

  const [user, setUser] = useState({});

  // Memoized function to fetch user data
  const getUser = useCallback(async () => {
    try {
      if (userId) {
        const response = await createAPIEndPointAuth("user/").fetchById(
          `${userId}`
        );
        localStorage.getItem("user_role", response.data?.userRole);
        // console.log("getUser ~ sssss:", response.data?)
        setUser(response.data || {});
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId, getUser]);

  return (
    <UserProfileContext.Provider value={{ user, getUser }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};
