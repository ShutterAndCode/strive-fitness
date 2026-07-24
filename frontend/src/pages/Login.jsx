import { EyeIcon, EyeOffIcon, LucideMail, UserIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";
import { useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const [loginState, setLoginState] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, signup, user } = useAppContext();
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    if (loginState == "login") {
      await login({ email, password });
    } else {
      await signup({ username, email, password });
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        (loginState == "login"
          ? "Login failed. Please check your credentials."
          : "Sign up failed. Please try again."),
    );
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  return (
    <>
    <Toaster></Toaster>
      <main className="login-page-container relative">
        <div className="absolute right-4 top-4">
          <ThemeToggle className="bg-white/80 text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {loginState === "login" ? "Log In" : "Sign Up"}
          </h2>
          <p className="text-sm mt-2 text-gray-600/90 dark:text-gray-400">
            {loginState === "login"
              ? "Please enter your details to login"
              : "Please create an Account"}
          </p>
          {/* userName */}
          {loginState !== "login" && (
            <div className="mt-4">
              <label
                htmlFor="userName"
                className="font-medium text-sm text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="relative mt-2">
                <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" />
                <input
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                  type="text"
                  name="userName"
                  id="userName"
                  placeholder="Enter Username"
                  className="login-input"
                  required
                />
              </div>
            </div>
          )}
          {/* email */}
          <div className="mt-4">
            <label
              htmlFor="email"
              className="font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-2">
              <LucideMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" />
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                type="email"
                name="email"
                id="email"
                placeholder="Please enter your email"
                className="login-input"
                required
              />
            </div>
          </div>
          {/* password */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Enter your password"
                className="login-input pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting
              ? "Signing In..."
              : loginState === "login"
                ? "Login"
                : "Sign up"}
          </button>

          {loginState === "login" ? (
            <p className="text-center py-6 text-sm text-gray-500">
              Don't have an Account?
              <button
                onClick={() => {
                  setLoginState("sign-up");
                }}
                className="ml-1 cursor-pointer text-white hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-center py-6 text-sm text-gray-500">
              Already have an account?
              <button
                onClick={() => {
                  setLoginState("login");
                }}
                className="ml-1 cursor-pointer text-white hover:underline"
              >
                Log in
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
