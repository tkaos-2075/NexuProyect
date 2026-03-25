import { useAuthContext } from "@contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from "@components/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
	const { session } = useAuthContext();
	const location = useLocation();
	
	// No mostrar Navbar en la página de bienvenida (ruta raíz)
	const isWelcomePage = location.pathname === '/';
	const shouldShowNavbar = session && !isWelcomePage;

	return (
		<>
			{shouldShowNavbar && <Navbar />}
			<Outlet />
		</>
	);
}
