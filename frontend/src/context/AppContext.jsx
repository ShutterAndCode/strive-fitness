import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mockApi from "../services/mockAPI";
import AppContext from "./appContext";

const hasRequiredProfile = (profile) =>
  profile?.age != null && profile?.weight != null && Boolean(profile?.goal);

const shouldRequireOnboarding = (profile) => {
  if (!profile) {
    return true;
  }

  return !hasRequiredProfile(profile);
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUserFetched, setIsUserFetched] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);

  const signup = async (credentials) => {
    const { data } = await mockApi.auth.register(credentials);
    setUser(data.user);
    setIsOnboardingCompleted(false);
    setIsUserFetched(true);
    localStorage.setItem("token", data.jwt);
  };

  const login = async (credentials) => {
    const { data } = await mockApi.auth.login(credentials);
    const nextUser = { ...data.user, token: data.jwt };

    setUser(nextUser);
    setIsOnboardingCompleted(!shouldRequireOnboarding(nextUser));
    setIsUserFetched(true);
    localStorage.setItem("token", data.jwt);
  };

  const fetchUser = async (token) => {
    const { data } = await mockApi.user.me();
    const nextUser = { ...data, token };

    setUser(nextUser);
    setIsOnboardingCompleted(!shouldRequireOnboarding(nextUser));
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async () => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();
    setAllActivityLogs(data);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOnboardingCompleted(false);
    setIsUserFetched(true);
    navigate("/");
  };

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    isOnboardingCompleted,
    setIsOnboardingCompleted,
    allFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
    setAllFoodLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
