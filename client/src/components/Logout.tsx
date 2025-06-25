import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // путь поправь под себя

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().finally(() => {
      navigate("/admin", { replace: true });
    });
  }, [logout, navigate]);

  return <p>Выход...</p>;
};

export default Logout;
