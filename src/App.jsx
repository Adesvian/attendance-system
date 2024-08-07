import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./containers";
import "./app.css";
import Login from "./pages/login";
import checkAuth from "./app/auth";

const token = checkAuth();

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Navigate
                to={
                  token && token.role === "admin"
                    ? "/dashboard-admin"
                    : token && token.role === "guru"
                    ? "/dashboard-guru"
                    : token && token.role === "parent"
                    ? "/dashboard-wali-murid"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
