import axios from "axios";

// A single, pre-configured Axios instance for the whole app to import.
// Every request made through this instance automatically gets:
//   - the correct backend base URL
//   - a JSON content-type header
//   - the current user's JWT (if one exists) attached as an Authorization header
//
// This is the ONLY place in the codebase that should know about the base URL,
// the token's storage key, or the header format. Everything else just imports
// this instance and calls api.get(...) / api.post(...) etc.
const api = axios.create({
  // baseURL means every call site can use a relative path, e.g. api.get("/food-logs"),
  // instead of repeating the full backend URL everywhere. If the backend's URL
  // ever changes (local -> staging -> production), this is the only line that changes.
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Default header for every request. Individual requests can still override
  // this per-call if a future endpoint ever needs a different content type
  // (e.g. multipart/form-data for the AI Food Snap image upload).
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- REQUEST INTERCEPTOR -----------------------------------------------
// Runs before every outgoing request, no matter which page or component
// triggered it. Its only job right now is to attach the JWT, if we have one,
// so that individual page components never have to think about auth headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Something went wrong building the request itself (rare — e.g. a bad
    // config). Reject so the calling code's .catch()/try-catch still fires.
    return Promise.reject(error);
  },
);

// ---- RESPONSE INTERCEPTOR -----------------------------------------------
// Runs after every response (success or failure) comes back, before the
// calling code sees it. For now this is intentionally a pass-through: it
// doesn't inspect status codes or do anything special with errors yet.
// Global handling (e.g. auto-logout on 401) will be added here later, in one
// place, once we build that behavior deliberately in a future step.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    // Don't treat a failed login/register attempt as a "session expired"
    // event — a wrong password IS a 401, but the user was never logged in
    // to begin with, so there's no session to tear down. That case should
    // just be shown inline on the Login form (a separate, later fix).
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);

// ---- RESOURCE METHODS ---------------------------------------------------
// Grouped to mirror mockAPI.js's shape exactly (auth / user / foodLogs /
// activityLogs), so page components can eventually swap their import from
// "../services/mockAPI" to "../services/api" with no other call-site changes.
//
// Each function just returns the Axios promise directly instead of manually
// unwrapping/rewrapping the response. This works out because an Axios
// response object already has a `.data` property holding the parsed JSON
// body — which is exactly the `{ data: ... }` shape mockAPI.js hand-built.
// So `const { data } = await api.foodLogs.list()` keeps working unchanged:
// `data` becomes whatever JSON the backend actually sent back.
const auth = {
  // Real backend expects { email, password } — matches what Login.jsx sends.
  login: (credentials) => api.post("/auth/login", credentials),

  // Real backend expects { username, email, password }.
  register: (credentials) => api.post("/auth/register", credentials),
};

const user = {
  // No id/token needs to be passed manually — the request interceptor above
  // already attaches the JWT, and the backend identifies "me" from that token.
  me: () => api.get("/users/me"),

  // The mock's signature is (id, updates); the real backend doesn't need an
  // id in the URL since /users/me always refers to the authenticated user.
  // The unused first argument is kept so existing call sites
  // (mockApi.user.update(user?.id || "", updates)) don't need to change yet.
  update: (updates) => api.patch("/users/me", updates), // issue why onboaring was not being updated properlywith height weight etc
};

const foodLogs = {
  list: () => api.get("/food-logs"),

  // FoodLog.jsx currently calls create({ data: formData }) — unwrap that
  // wrapper here so the backend just receives the plain fields it expects.
  create: (payload) => api.post("/food-logs", payload?.data ?? payload),

  // ActivityLog.jsx/FoodLog.jsx currently call update(documentId, updates)
  // with a flat object — send it straight through as the request body.
  update: (documentId, updates) =>
    api.patch(`/food-logs/${documentId}`, updates),

  delete: (documentId) => api.delete(`/food-logs/${documentId}`),
};

const activityLogs = {
  list: () => api.get("/activity-logs"),
  create: (payload) => api.post("/activity-logs", payload?.data ?? payload),
  update: (documentId, updates) =>
    api.patch(`/activity-logs/${documentId}`, updates),
  delete: (documentId) => api.delete(`/activity-logs/${documentId}`),
};
const foodSnap = {
  analyze: (formData) =>
    api.post("/food-snap", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
// Named export in case a file ever needs the raw configured instance
// directly (e.g. for a one-off multipart upload request for AI Food Snap).
export { api };

// Default export mirrors mockAPI.js's default export shape:
// { auth, user, foodLogs, activityLogs } — so a page's only required change,
// when the time comes, is the import path itself.
export default { auth, user, foodLogs, activityLogs, foodSnap };
