import {
  GoogleLoginSingup,
  userRegister,
  verification,
} from "@/api/auth/queries";
import type { registerPayload, verifyEmailPayload } from "@/api/auth/type";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, EyeOff, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { addProfileImage } from "@/api/product/queries";
import { GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [showPassword, setShowPassword] = useState(false);

  // image states
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // otp states
  const [otp, setOtp] = useState("");
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);

  // 🔹 upload mutation
  const uploadMutation = addProfileImage.useMutation({
    onSuccess: (data) => {
      setProfileImageUrl(data.url); // save backend url
    },
    onError: (err) => {
      console.error("Upload failed:", err);
      alert("Image upload failed!");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      uploadMutation.mutate({ image: file });
    }
  };

  const registerMutation = userRegister.useMutation({
    onSuccess: () => {
      setIsVerificationDialogOpen(true);
      alert(
        "Registration successful! Please verify your email with the OTP sent to your inbox."
      );
    },
    onError: (error) => {
      alert("Registration Failed");
      console.error("Registration error:", error);
    },
  });

  const registerClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload: registerPayload = {
      email,
      password,
      userName,
      age: age || 0,
      profileImageUrl: profileImageUrl || "",
    };
    console.log("Register payload:", payload);
    registerMutation.mutate(payload);
  };

  const verificationMutation = verification.useMutation({
    onSuccess: () => {
      alert("Email verified successfully!");
      setIsVerificationDialogOpen(false);
      setOtp("");
      navigate("/login");
    },
    onError: (error) => {
      alert("Verification Failed");
      console.error("Verification error:", error);
    },
  });

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP.");
      return;
    }
    const payload: verifyEmailPayload = { email, otp };
    verificationMutation.mutate(payload);
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
    googleLoginMutation.mutate({ token });
  };

  return (
    <div className="min-h-screen w-[28%] flex items-center justify-center bg-gray-100">
      <div className="w-full bg-white p-4 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-2 border rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full pl-10 p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* Age */}
          <div className="relative">
            <Calendar
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="number"
              placeholder="Age"
              className="w-full pl-10 p-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
                setAge(value === "" ? "" : parseInt(value));
              }}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="relative w-full mt-6">
            {/* <ImageIcon
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            /> */}
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-md shadow transition"
            >
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <span id="file-name" className="text-gray-700 text-sm ml-10">
              No file chosen
            </span>

            {uploadMutation.isPending && (
              <p className="text-sm text-blue-500 mt-2">Uploading...</p>
            )}

            {/* {profileImageUrl && (
              <div className="mt-3">
                <img
                  src={profileImageUrl}
                  alt="Uploaded Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              </div>
            )} */}
          </div>

          {/* Register Button */}
          <div className="flex justify-center mt-6">
            <Button
              type="button"
              onClick={registerClick}
              disabled={registerMutation.isPending}
              className="w-full p-4 rounded-xl"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In */}
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              googleLogin(credentialResponse.credential || "");
            }}
            onError={() => toast.error("Google Login Failed!")}
          />
        </form>

        {/* OTP Dialog */}
        <AlertDialog
          open={isVerificationDialogOpen}
          onOpenChange={setIsVerificationDialogOpen}
        >
          <AlertDialogContent className="max-w-md rounded-2xl shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-xl font-bold text-gray-800">
                Enter Verification Code
              </AlertDialogTitle>
              <p className="text-center text-sm text-gray-500">
                We have sent a 6-digit OTP to your registered email.
              </p>
            </AlertDialogHeader>
            <div className="flex justify-center mt-6">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                containerClassName="gap-3"
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      className="w-12 h-12 text-lg rounded-md"
                      index={i}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                className="w-[60%]"
                onClick={verifyOtp}
                disabled={verificationMutation.isPending || otp.length !== 6}
              >
                {verificationMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Register;
