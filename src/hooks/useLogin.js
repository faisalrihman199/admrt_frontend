import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../constants/queryKeys";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { userLoginApi } from "../service/auth";
import {
  setProfileImageToLocalStorage,
  setProfileNameToLocalStorage,
} from "../util/localStorageUtils";
import { toast } from "react-toastify";

export function useLogIn() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const logIn = async (email, password) => {
    try {
      let data = await userLoginApi(email.toLowerCase(), password);
      if (data.access && data.refresh && data.user) {      
        console.log("Logged user :", data.user.user_role);
        
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
        if(data?.user?.user_role==='admin'){
          
          window.location.href="/admin/accounts"
        }
        else{
          window.location.href="/"
        }
        
        
      
        
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
