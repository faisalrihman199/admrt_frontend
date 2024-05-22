import apiClient from "../util/apiClient";

export async function addAddSpace({ authHeader, data }) {
  try {
    const response = await apiClient.post("/profile/ad-space/", data, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAdSpace({ authHeader, id }) {
  try {
    const response = await apiClient.delete(`/profile/ad-space/${id}/`, {
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

export async function searchAdSpace({ authHeader, filterOptions }) {
  try {
    // const [_key, { authHeader, filterOptions }] = queryKey;

    let url = "/ad-space/search/";

    console.log("urlObj", filterOptions);
    if (filterOptions && Object.keys(filterOptions).length > 0) {
      const queryString = Object.entries(filterOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      url += "?" + queryString;
    }

    console.log("url", url);

    const response = await apiClient.get(url, {
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
