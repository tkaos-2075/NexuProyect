import { createBrowserRouter } from "react-router-dom";
import App from "src/App";
import { ProtectedRoute } from "@router/ProtectedRoute";
import Login      from "@pages/LoginPage";
import Register   from "@pages/RegisterPage";
import Dashboard  from "@pages/DashboardPage";
import ProfilePage from "@pages/ProfilePage";
import NotFound   from "@pages/NotFoundPage";
import WelcomePage from "@pages/WelcomePage";
import LabelsPage from '@pages/LabelsPage';
import PlaceDetailsPage from '@pages/PlaceDetailsPage';
import PlacesPage from '@pages/PlacesPage';

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <WelcomePage /> },
			{
				path: "auth",
				children: [
					{path: "login",    element: <Login /> },
					{path: "register",    element: <Register /> }
				],
			},
			{
				element: <ProtectedRoute />,
				children: [
					{path: "dashboard",    element: <Dashboard /> },
					{path: "profile",      element: <ProfilePage /> },
					{path: "place/:type/:id", element: <PlaceDetailsPage /> },
					{path: '/places', element: <PlacesPage /> },
					{path: '/labels', element: <LabelsPage />},
				],
			},
			{
				path: "*", element: <NotFound />
			},
		],
	},
]);
