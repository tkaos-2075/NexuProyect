import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "src/contexts/AuthContext";

export function ProtectedRoute() {
	const authContext = useAuthContext();

	if (authContext.isLoading) return null;

	if (!authContext.session)
		return <Navigate to="/" replace />;

	return <Outlet />;
}
