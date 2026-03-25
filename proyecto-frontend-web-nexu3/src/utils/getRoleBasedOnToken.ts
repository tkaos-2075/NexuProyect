import { jwtDecode } from "jwt-decode";

type UserRole = 'USER' | 'ADMIN' | 'VIEWER';

interface DecodedToken {
	role: UserRole;
	sub: string;
	iat: number;
	exp: number;
}

export function getRoleBasedOnToken(): UserRole {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("Token not found");
	
	const decodedToken = jwtDecode<DecodedToken>(token);
	
	// Verificar que existe la propiedad role
	if (!decodedToken.role) {
		throw new Error("Role not found in token");
	}
	
	return decodedToken.role;
}
