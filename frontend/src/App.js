import "antd/dist/reset.css";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import InitialPage from "./pages/InitialPage";
import HomePage from "./pages/HomePage";
import AdminHome from "./pages/AdminHome";
import HospitalAdmin from "./pages/Admin/HospitalAdmin";

function App() {
  const isUserAuthenticated = () => {
    if (localStorage.getItem("health-user-type")) {
      return {
        type: localStorage.getItem("health-user-type"),
        id: localStorage.getItem("health-user-id"),
      };
    }
  };
  return (
    <div className="App">
      {/* Initial */}
      <Routes>
        {!isUserAuthenticated()?.type && !isUserAuthenticated()?.id ? (
          <Route path="/" element={<InitialPage />} />
        ) : isUserAuthenticated()?.type === "admin" ? (
          <Route path="*" element={<Navigate to="/admin-home" />} />
        ) : (
          <Route path="*" element={<Navigate to="/home" />} />
        )}
        {/* Admin Home */}
        {isUserAuthenticated()?.type === "admin" &&
        isUserAuthenticated()?.id ? (
          <Route path="/admin-home" element={<AdminHome />} />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        {/* Admin Hospital */}
        {isUserAuthenticated()?.type === "admin" &&
        isUserAuthenticated()?.id ? (
          <Route path="/admin-hospital" element={<HospitalAdmin />} />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        {/* Client Home */}
        {isUserAuthenticated()?.type === "client" &&
        isUserAuthenticated()?.id ? (
          <Route path="/home" element={<HomePage />} />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
