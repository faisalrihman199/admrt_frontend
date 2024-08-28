import apiClient from "../util/apiClient";

async function userLoginApi(email, password) {
  try {
    const response = await apiClient.post("/auth/jwt/create", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function userRegisterApi(user) {
  try {
    const response = await apiClient.post("/auth/users/", user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function forgetPasswordApi(email) {
  try {
    const response = await apiClient.post("/settings/users/reset_password/", {
      email,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    throw error;
  }
}

async function resetPasswordApi(otp, newPassword, email) {
  try {
    const response = await apiClient.post("/settings/users/reset_password_confirm/", {
      email,
      reset_code: otp,
      new_password: newPassword,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    throw error;
  }
}

export { userLoginApi, userRegisterApi,forgetPasswordApi,resetPasswordApi };
