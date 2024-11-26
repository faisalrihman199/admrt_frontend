import apiClient from "../util/apiClient";

export async function otherUserProfile({ queryKey }) {
  try {
    const [_key, { authHeader, userId }] = queryKey;
    const response = await apiClient.get(`/profile/?id=${userId}`, {
      headers: {
        Authorization: authHeader,
      },
    });
    console.log("called api");
    return response.data;
  } catch (error) {
    throw error;
  }
}
