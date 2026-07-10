import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockApi from "../services/mockAPI";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [isonboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allAcitivityLogs, setAllAcitivityLogs] = useState([]);

  const signup = async (crendentials) => {
    const { data } = await mockApi.auth.register(crendentials);
    setUser(data.user);
    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setIsOnboardingCompleted(true);
    }
    localStorage.setItem("token", data.jwt);
  };

  const login = async (crendentials) => {
    const { data } = await mockApi.auth.login(credentials);
    setUser({ ...data.user, token: data.jwt });
    if (data?.user?.age && data?.user?.weight && data?.user?.goal) {
      setIsOnboardingCompleted(true);
    }
    localStorage.setItem("token", data.jwt);
  };

  const fetchUser = async (token) => {
    const { data } = mockApi.user.me();
    setUser({ ...data, token });
    if (data?.age && data?.weight && data?.goal) {
      setIsOnboardingCompleted(true);
    }
    setIsUserFetched(true);
  };
  const fetchFoodLogs = async () => {
    const { data } = mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();
    setAllAcitivityLogs(data);
  };

  const logout = async (params) => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOnboardingCompleted(false);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs();
        await fetchActivityLogs();
      })();
    } else {
      setIsUserFetched(true);
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    isonboardingCompleted,
    setIsOnboardingCompleted,
    allFoodLogs,
    allAcitivityLogs,
    setAllAcitivityLogs,
    setAllFoodLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
