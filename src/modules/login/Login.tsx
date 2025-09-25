import { GoogleLoginSingup, userLogin } from "@/api/auth/queries";
import type { loginPayload } from "@/api/auth/type";
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const keyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loginClick();
      e.preventDefault();
    }
  };

  const loginMutation = userLogin.useMutation({
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 1, path: "" });
      Cookies.set("userName", data.userName, { expires: 1, path: "" });
      Cookies.set("roleName", data.roleName, { expires: 1, path: "" });
      navigate("/home");
      alert("Login Successfully");
      console.log(data.message);
      console.log("Token", data.token);
    },
    onError: (error) => {
      alert("Login Failed");
      console.error("Login error:", error);
    },
  });

  const loginClick = async () => {
    const payload: loginPayload = {
      email: email,
      password: password,
    };

    loginMutation.mutate(payload);
  };

  const googleLoginMutation = GoogleLoginSingup.useMutation({
    onSuccess: (data) => {
      Cookies.set("token", data.token);
      navigate("/home");
      toast.success("Google Login Successfully");
    },
    onError: () => {
      alert("Google Login Failed! Please Try Again");
      toast.error("Google Login Failed! Please Try Again");
    },
  });

  const googleLogin = async (token: string) => {
    googleLoginMutation.mutate({token});
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <form className="shadow-lg rounded-xl p-8 w-[400px] sm:w-[450px]">
          <div className="flex justify-center">
            <img src="/image/logo.png" width={100} height={80} alt="logo" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <i className="pi pi-at"></i>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={keyEnter}
              placeholder="Enter Email"
              className="w-full rounded-lg border border-gray-300 py-2 pl-2 pr-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={keyEnter}
              placeholder="Enter Password"
              className="w-full rounded-lg border border-gray-300 py-2 pl-2 pr-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-4">
            <Link
              to={"/varifyEmail"}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={loginClick}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
                googleLogin(credentialResponse.credential || "");
            }}
            onError={() => toast.error("Google Login Failed!")}
          />

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            New to Logistics?
            <Link
              to={"/register"}
              className="ml-2 text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
