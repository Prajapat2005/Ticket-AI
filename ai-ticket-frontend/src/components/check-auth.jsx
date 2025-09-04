import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");
    } else {
      setLoading(false);
    }

  }, [navigate]);

  if (loading) {
    return <div>loading...</div>;
  }
  return children;
}

export default CheckAuth;
