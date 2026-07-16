import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockApi from "../services/mockAPI";
import AppContext from "./appContext";
import toast from "react-hot-toast";

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
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsUserFetched(true);
        return;
      }

      setIsUserFetched(false);

      try {
        const { data } = await mockApi.user.me();

        setUser(data);
        setIsOnboardingCompleted(!shouldRequireOnboarding(data));
        setIsUserFetched(true);

        const [{ data: foodData }, { data: activityData }] = await Promise.all([
          mockApi.foodLogs.list(),
          mockApi.activityLogs.list(),
        ]);

        setAllFoodLogs(foodData || []);
        setAllActivityLogs(activityData || []);
      } catch (error) {
        console.error("Failed to restore session", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsOnboardingCompleted(false);
        setIsUserFetched(true);
      }
    };

    restoreSession();
  }, []);
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsOnboardingCompleted(false);
      setIsUserFetched(true);
      navigate("/");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const signup = async (credentials) => {
    const { data } = await mockApi.auth.register(credentials);
    const nextUser = data.user;

    setUser(nextUser);
    setIsOnboardingCompleted(false);
    setIsUserFetched(true);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    localStorage.setItem("token", data.jwt);
  };

  const login = async (credentials) => {
    const { data } = await mockApi.auth.login(credentials);

    setUser(data.user);
    setIsOnboardingCompleted(!shouldRequireOnboarding(data.user));
    setIsUserFetched(true);
    localStorage.setItem("token", data.jwt);

    const [{ data: foodData }, { data: activityData }] = await Promise.all([
      mockApi.foodLogs.list(),
      mockApi.activityLogs.list(),
    ]);

    setAllFoodLogs(foodData || []);
    setAllActivityLogs(activityData || []);
  };

  const fetchUser = async () => {
    const { data } = await mockApi.user.me();

    setUser(data);
    setIsOnboardingCompleted(!shouldRequireOnboarding(data));
    setIsUserFetched(true);

    const [{ data: foodData }, { data: activityData }] = await Promise.all([
      mockApi.foodLogs.list(),
      mockApi.activityLogs.list(),
    ]);

    setAllFoodLogs(foodData || []);
    setAllActivityLogs(activityData || []);
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
    try {
      const confirm = window.confirm("Are you sure you want to log out?");

      if (!confirm) return;

      localStorage.removeItem("token");
      setUser(null);
      setIsOnboardingCompleted(false);
      setIsUserFetched(true);

      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out");
    }
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
