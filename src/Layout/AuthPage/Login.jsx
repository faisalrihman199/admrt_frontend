import React, { useState } from "react";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import svg1 from './images/ic_google logo (1).svg'
import svg2 from './images/ic_fb logo.svg'
import SlideShow from "./../../Layout/SlideShow";
import { signInWithGooglePopup, facebookProvider, auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useLogIn } from "../../hooks/useLogin";
import Alert from "../../components/allert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState('password');
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [icon, setIcon] = useState(eyeOff);
  const [loading, setLoading] = useState(false)
  const [loginErrorMessage, setLoginErrorMessage] = useState('')



  const logIn = useLogIn();

  const navigate = useNavigate();

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text')
    } else {
      setIcon(eyeOff)
      setType('password')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email address");
      setLoading(false)
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setLoading(false)
      return;
    }

    try {
      // await signInWithEmailAndPassword(auth, email, password);

      await logIn(email, password)

      // setLoading(false)
      // navigate(`/`);
    } catch (error) {
      setErrorMessage("There was an error logging in. Please check your information and try again.");
      setLoading(false)
    }
  }


  const handleGoogleLogin = async () => {
    try {
      await signInWithGooglePopup()
      navigate(`/`);
    } catch (error) {
      console.error(error);
      setErrorMessage("There was an error logging in with Google. Please try again.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookProvider()
      navigate(`/`);
    } catch (error) {
      console.error(error);
      setErrorMessage("There was an error logging in with Facebook. Please try again.");
      setLoading(false)
    }
  };

  return (
    <div className="login-container min-h-screen md:flex">
      <div className="md:w-1/2">
        <SlideShow />
      </div>
      <section className="max-w-screen-2xl mx-auto px-4 h-full md:min-h-screen flex justify-center items-center md:w-1/2">
        <div className="flex  w-full h-full flex items-center justify-center mx-auto  lg:py-0">
          <div className="w-full bg-white max-w-2xl rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div>
              <h1 className="mb-2 font-normal text-3xl lg:text-5xl sm:text-3xl">
                Sign In
              </h1>
              <p className="my-4 text-sm md:text-base font-light md:my-8">Don’t have an account? <span className="text-blue-700 font-normal cursor-pointer"><a href="/continue">Create an account</a></span></p>
              {/* {loginErrorMessage && <p className="text-red-500">{loginErrorMessage}</p>} */}
              <form className="md:space-y-6" onSubmit={handleLogin}>
                {errorMessage &&
                  <Alert type="error" message={errorMessage} />
                }
                <div>
                  <h3 className="text-base font-medium">Email Address</h3>
                  <input
                    type="email"
                    name="email"
                    className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1 ${emailError ? 'border-red-500' : ''}`}
                    // placeholder="example@gmail.com|"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                </div>
                <div>
                  <label className="password-container block mt-5 md:mt-8">
                    <h3 className="text-base font-normal">Password</h3>
                    <div className='flex'>
                      <input
                        className={`mt-2.5 px-3 py-3 md:py-4 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-blue-600 block w-full rounded-xl focus:ring-1 ${passwordError ? 'border-red-500' : ''}`}
                        type={type}
                        name="password"
                        // placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <span className="flex justify-around items-center" onClick={handleToggle}>
                        <Icon className="absolute mr-14 mt-2" icon={icon} size={20} />
                      </span>
                    </div>
                  </label>
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                </div>
                <div className="flex items-center my-2 justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center  h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4  border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="/forgotpassword" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <button type="submit" className="mt-5 w-full md:mt-8 social-card bg-blue-500 text-white border rounded-xl  py-2 text-center hover:border-blue-600  hover:shadow-md md:px-16">
                  <div className=" text-center text-gray-800 font-normal py-1 md:py-2 px-4 rounded inline-flex items-center">
                    <span className="ml-1 md:ml-2 text-white">{loading ? "Loading..." : "Sign in"}</span>
                  </div>
                </button>
              </form>
              <div className="relative flex items-center justify-center w-full my-10 border border-t">
                {/* <div className="absolute px-5 bg-white">or</div> */}
              </div>
              {/* <div className="mt-3 flex justify-center items-center text-center w-full social-card text-gray-800 md:font-normal google border font-light rounded-xl py-4 px-4 text-center hover:border-blue-600 hover:shadow-md md:px-16"
                onClick={handleGoogleLogin}
              >
                <img src={svg1} alt="Google" />
                <span className="ml-1 md:ml-2">Sign in with Google</span>
              </div>
              <div className="mt-3 flex justify-center items-center text-center w-full social-card text-gray-800 md:font-normal facebook border font-light rounded-xl py-4 px-4 text-center hover:border-blue-600 hover:shadow-md md:px-16"
                onClick={handleFacebookLogin}
              >
                <img src={svg2} alt="Facebook" />
                <span className="ml-1 md:ml-2">Sign in with Facebook</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
