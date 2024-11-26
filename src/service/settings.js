import apiClient from "../util/apiClient";

export async function userSettings({ queryKey }) {
  try {
    const [_key, { authHeader }] = queryKey;
    const response = await apiClient.get("/settings/", {
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

export async function updateSettings({ authHeader, data }) {
  try {
    const response = await apiClient.post("/settings/", data, {
      headers: {
        Authorization: authHeader,
      },
    });
    return response.data;
  } catch (error) {
    alert("Something Went wrong");
    console.log(error);
    throw error;
  }
}
