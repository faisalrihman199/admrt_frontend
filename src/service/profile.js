import apiClient from "../util/apiClient";

export async function userProfile({ queryKey }) {
  try {
    const [_key, { authHeader }] = queryKey;
    const response = await apiClient.get("/profile/", {
      headers: {
        Authorization: authHeader,
      },
    });
    // console.log("called api");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addProfileTopic({ authHeader, data }) {
  try {
    // console.log("im here");

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

export async function deleteProfileTopic({ authHeader, id }) {
  try {
    // console.log("im here");

    const response = await apiClient.delete(`/profile/topics/${id}/`, {
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

export async function addLanguage({ authHeader, data }) {
  try {
    // console.log("im here");

    const response = await apiClient.post("/profile/languages/", data, {
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

export async function deleteSocial({ authHeader, id }) {
  try {
    // console.log("authHeader", authHeader);
    const response = await apiClient.delete(`/profile/socials/${id}/`, {
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

export async function updateProfile({ authHeader, data }) {

  
  try {
    const response = await apiClient.post("/profile/", data, {
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
export async function updateProfileWithFile({ authHeader, formData }) {
  try {
    const response = await apiClient.post("/profile/portfolios/", formData, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    alert("Something Went wrong");
    console.log(error);
    throw error;
  }
}

export async function addProduct({ authHeader, formData }) {
  try {
    const response = await apiClient.post("/profile/products/", formData, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    alert("Something Went wrong");
    console.log(error);
    throw error;
  }
}
export async function allProducts({ authHeader }) {
  try {
    const response = await apiClient.get("/profile/product/", {
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

export async function updateSingleImage({ authHeader, data }) {
  try {
    const response = await apiClient.post("/profile/", data, {
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

export async function deletePortfolio({ authHeader, portfolioId }) {
  try {
    // console.log("authHeader", authHeader);
    const response = await apiClient.delete(
      `/profile/portfolios/${portfolioId}/`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteProduct({ authHeader, productId }) {
  try {
    // console.log("authHeader", authHeader);
    const response = await apiClient.delete(`/profile/products/${productId}/`, {
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
