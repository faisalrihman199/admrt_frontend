import apiClient from "../util/apiClient";

export async function userProfile({ queryKey }) {
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

export async function addProfileTopic({ authHeader, data }) {
  try {
    console.log("im here");

    const response = await apiClient.post("/profile/topics/", data, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function addProfileSocials({ authHeader, data }) {
  try {
    console.log("im here");

    const response = await apiClient.post("/profile/socials/", data, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export default userProfile;
