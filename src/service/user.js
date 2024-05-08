import apiClient from "../util/apiClient";

async function userProfile({ queryKey }) {
  try {
    const [_key, { authHeader }] = queryKey;
    const response = await apiClient.get("/auth/users/me/", {
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

export default userProfile;
