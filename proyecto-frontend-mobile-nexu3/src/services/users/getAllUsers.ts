import Api from "@services/api";

export async function getAllUsers() {
  const api = await Api.getInstance();
  const response = await api.get<any, any>({
    url: "/users"
  });
  return response;
} 