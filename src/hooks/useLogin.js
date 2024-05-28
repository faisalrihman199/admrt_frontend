import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../constants/queryKeys";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { userLoginApi } from "../service/auth";
import {
  setProfileImageToLocalStorage,
  setProfileNameToLocalStorage,
} from "../util/localStorageUtils";

export function useLogIn() {
  const navigate = useNavigate();
  const signIn = useSignIn();

  const logIn = async (email, password) => {
    try {
      const data = await userLoginApi(email, password);
      if (data.access && data.refresh && data.user) {
        signIn({
          auth: {
            token: data.access,
            type: "JWT",
          },
          // refresh: data.refresh,
          userState: data.user,
        });
        setProfileImageToLocalStorage(data?.user?.profile_image);
        setProfileNameToLocalStorage(data?.user?.full_name);
        window.location.href = "/";
      } else {
        console.error("im here");
        throw new Error("Invalid response from server login.");
      }
    } catch (error) {
      console.error("im here 2");

      console.error("im here 2", error);
      throw error;
    }
  };

  return logIn;
}
