import Api from '@services/api';

export async function deleteUser(id: number): Promise<void> {
  const api = await Api.getInstance();
  await api.delete({ url: `/users/${id}` });
} 