import { UsersResponseDto } from "@interfaces/user/UsersResponseDto";
import Api from "@services/api";

export async function getCurrentUser() {
	const api = await Api.getInstance();
	const response = await api.get<void, UsersResponseDto>({
		url: "/users/me"
	});
	return response;
}
