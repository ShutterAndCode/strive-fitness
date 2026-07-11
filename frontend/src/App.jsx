import { Route, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import FoodLog from "./pages/FoodLog";
import ActivityLog from "./pages/ActivityLog";
import Profile from "./pages/Profile";
import { useAppContext } from "./context/useAppContext";
import Login from './pages/Login'
import Loading from './components/loading'
import Onboarding from './pages/Onboarding'
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, isUserFetched, isOnboardingCompleted } = useAppContext();
  const profileIsComplete =
    user?.age != null && user?.weight != null && Boolean(user?.goal);

  if (!isUserFetched) {
    return <Loading />;
  }

  if (!user) {
    return <Login />;
  }

  if (!isOnboardingCompleted || !profileIsComplete) {
    return <Onboarding />;
  }

  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />}></Route>
          <Route path="activity" element={<ActivityLog />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
