import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import FoodLog from "./pages/FoodLog";
import ActivityLog from "./pages/ActivityLog";
import Profile from "./pages/Profile";
import { useAppContext } from "./context/useAppContext";
import Login from "./pages/Login";
import Loading from "./components/loading";
import Onboarding from "./pages/Onboarding";
import { Toaster } from "react-hot-toast";

function App() {
  const { user, isUserFetched, isOnboardingCompleted } = useAppContext();

  if (!isUserFetched) {
    return <Loading />;
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/onboarding"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : isOnboardingCompleted ? (
              <Navigate to="/" replace />
            ) : (
              <Onboarding />
            )
          }
        />

        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : !isOnboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : (
              <Layout />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
