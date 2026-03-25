import Api from "@services/api";

export async function deleteLabel(id: number) {
  const api = await Api.getInstance();
  return api.delete({ url: `/labels/${id}` });
} 