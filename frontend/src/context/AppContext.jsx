import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mockApi from "../services/mockAPI";
import api from "../services/api";
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
      console.log("restoreSession running");
      const token = localStorage.getItem("token");

      if (!token) {
        setIsUserFetched(true);
        return;
      }

      setIsUserFetched(false);

      try {
        const { data } = await api.user.me();
        const currentUser = data.data;

        setUser(currentUser);
        setIsOnboardingCompleted(!shouldRequireOnboarding(currentUser));
        setIsUserFetched(true);

        const [{ data: foodData }, { data: activityData }] = await Promise.all([
          api.foodLogs.list(),
          mockApi.activityLogs.list(),
        ]);

        setAllFoodLogs(foodData.data || []);
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
    const { data } = await api.auth.register(credentials);
    const { user: newUser, token } = data.data;

    setUser(newUser);
    setIsOnboardingCompleted(false);
    setIsUserFetched(true);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    localStorage.setItem("token", token);
  };

  const login = async (credentials) => {
    const { data } = await api.auth.login(credentials);
    const { user: loggedInUser, token } = data.data; //destructing nor better naming

    setUser(loggedInUser);
    setIsOnboardingCompleted(!shouldRequireOnboarding(loggedInUser));
    setIsUserFetched(true);
    localStorage.setItem("token", token);

    const [{ data: foodData }, { data: activityData }] = await Promise.all([
      api.foodLogs.list(),
      mockApi.activityLogs.list(),
    ]);

    setAllFoodLogs(foodData.data || []);
    setAllActivityLogs(activityData || []);
  };

  const fetchUser = async () => {
    const { data } = await api.user.me();

    const currentUser = data.data;

    setUser(currentUser);
    setIsOnboardingCompleted(!shouldRequireOnboarding(currentUser));
    setIsUserFetched(true);

    const [{ data: foodData }, { data: activityData }] = await Promise.all([
      api.foodLogs.list(),
      mockApi.activityLogs.list(),
    ]);

    setAllFoodLogs(foodData.data || []);
  };

  const fetchFoodLogs = async () => {
    const { data } = await api.foodLogs.list();
    setAllFoodLogs(data.data);
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
