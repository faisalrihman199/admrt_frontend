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

/**
 * Register a new user.
 *
 * @param {Object} user - The user object.
 * @param {string} user.email - The user's email.
 * @param {string} user.password - The user's password.
 * @param {string} user.full_name - The user's full name.
 * @param {("space_host"|"advertiser")} user.user_role - The user's role, which can be either 'space_host' or 'advertiser'.
 * @param {string} user.phone_number - The user's phone number.
 * @param {string} user.country - The user's country.
 *
 * @returns {Promise<Object>} The response data.
 *
 * @throws {Error} If an error occurs during the API request.
 */
async function userRegisterApi(user) {
  try {
    const response = await apiClient.post("/auth/users/", user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { userLoginApi, userRegisterApi };
