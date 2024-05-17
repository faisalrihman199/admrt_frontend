import createStore from "react-auth-kit/createStore";
import axios from "axios";
import createRefresh from "react-auth-kit/createRefresh";

const refresh = createRefresh({
  interval: 900, // The time in sec to refresh the Access token, 15 minutes = 900 seconds
  refreshApiCallback: async (param) => {
    try {
      // const response = await refreshJwtToken(param.authToken);
      // console.log("Refreshing");
      // return {
      //   isSuccess: true,
      //   newAuthToken: response.data.token,
      //   newAuthTokenExpireIn: 10,
      //   newRefreshTokenExpiresIn: 60,
      // };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
      };
    }
  },
});

export const authStore = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
  // refresh: refresh,
});
