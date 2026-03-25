import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'USER' | 'ADMIN' | 'VIEWER';

interface DecodedToken {
	role: UserRole;
	sub: string;
	iat: number;
	exp: number;
}

export async function getRoleBasedOnToken(): Promise<UserRole | undefined> {
	try {
		const token = await AsyncStorage.getItem("token");
		if (!token) return undefined;
		const decodedToken = jwtDecode<DecodedToken>(token);
		if (!decodedToken.role) return undefined;
		return decodedToken.role;
	} catch (e) {
		return undefined;
	}
}
