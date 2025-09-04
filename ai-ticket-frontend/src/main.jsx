import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Outlet, useLocation } from "react-router-dom";
import CheckAuth from "./components/check-auth.jsx";
import Tickets from "./pages/tickets.jsx";
import TicketDetailsPage from "./pages/ticket.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Admin from "./pages/admin.jsx";
import Navbar from "./components/navbar.jsx";

// Layout with Navbar
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* renders child routes */}
    </>
  );
}

// Layout without Navbar (for login/signup)
function NoNavbarLayout() {
  return <Outlet />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes with Navbar */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <CheckAuth>
                <Tickets />
              </CheckAuth>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <CheckAuth>
                <TicketDetailsPage />
              </CheckAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <CheckAuth>
                <Admin />
              </CheckAuth>
            }
          />
        </Route>

        {/* Routes without Navbar */}
        <Route element={<NoNavbarLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
