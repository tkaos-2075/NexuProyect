import Api from '../api';
 
export async function deleteUser(id: number) {
  const api = await Api.getInstance();
  return api.delete({ url: `/users/${id}` });
} 