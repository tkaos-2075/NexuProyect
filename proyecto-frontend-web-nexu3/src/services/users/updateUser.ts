import Api from "@services/api";

export async function updateUser(id: number, data: { name: string; email: string; password?: string }) {
  const api = await Api.getInstance();
  return api.put<typeof data, any>(data, { url: `/users/${id}` });
} 