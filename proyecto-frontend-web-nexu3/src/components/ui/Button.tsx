// Botón de navegación reutilizable con estilos de Tailwind
import { useLocation, useNavigate } from "react-router-dom";

interface ButtonProps {
  to: string;
  message: string;
}

export default function Button({ to, message }: ButtonProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === to;

  // Cambia el color si está activo
  const buttonStyle = isActive
    ? "bg-purple-600 text-white shadow"
    : "bg-gray-300 hover:bg-gray-400";

  function handleClick() {
    navigate(to);
  }

  return (
    <button
      className={`rounded-full px-6 py-2 text-sm font-medium transition ${buttonStyle}`}
      onClick={handleClick}
    >
      {message}
    </button>
  );
}