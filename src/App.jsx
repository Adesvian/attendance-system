import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Layout from "./containers";
import "./app.css";
import Login from "./pages/login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { checkAuthCookies } from "./features/user/login-utils"; // Make sure to import the function

function App() {
  return (
    <Router basename="/attendance-system">
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Route for checking authentication and redirecting */}
        <Route path="/" element={<RedirectBasedOnRole />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout />} />
        </Route>
      </Routes>
    </Router>
  );
}

const RedirectBasedOnRole = () => {
  const navigate = useNavigate();
  const setErrorMessage = (msg) => {
    console.log(msg);
  };

  useEffect(() => {
    const redirect = async () => {
      await checkAuthCookies(setErrorMessage, navigate);
    };

    redirect();
  }, [navigate]);

  return null;
};

export default App;
