import {
  GoogleLoginSingup,
  userRegister,
  verification,
} from "@/api/auth/queries";
import { jwtDecode } from "jwt-decode";
import type { registerPayload, verifyEmailPayload } from "@/api/auth/type";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, EyeOff, Loader2, Mail, User, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Register = () => {
  const navigate = useNavigate();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [showPassword, setShowPassword] = useState(false);

  // image states
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // otp states
  const [otp, setOtp] = useState("");
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);

  // 🔹 upload mutation
  const uploadMutation = addProfileImage.useMutation({
    onSuccess: (data) => {
      setProfileImageUrl(data.url);
    },
    onError: (err) => {
      console.error("Upload failed:", err);
      alert("Image upload failed!");
    },
  });

  const handleImageUpload = async (file: File) => {
    setImagePreview(URL.createObjectURL(file)); // Show blob preview immediately
    try {
      const result = await uploadMutation.mutateAsync({ image: file });
      const fullImageUrl = `https://localhost:7108/api/${result.url}`;
      setProfileImageUrl(fullImageUrl);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload profile image");
      console.error("Upload error:", error);
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

  const googleLogin = async (token: string, ProfileImageUrl: string) => {
    googleLoginMutation.mutate({ token, ProfileImageUrl });
  };

  const isLoading = uploadMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen w-full lg:w-[40%] flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-0">
      <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-[450px] border border-[#dcdcdc]">
        <div className="flex justify-center mb-2">
          <img
            src="/image/LuxeLookLogo.jpg"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full md:rounded-full"
            alt="logo"
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4">
          Create an Account
        </h2>

        <form className="space-y-3 sm:space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-2 border border-[#dcdcdc] bg-[#ffffff] rounded-xl text-sm sm:text-base"
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
              className="w-full p-2 pr-10 border border-[#dcdcdc] bg-[#ffffff] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full pl-10 p-2 border border-[#dcdcdc] bg-[#ffffff] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base"
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
              className="w-full pl-10 p-2 border border-[#dcdcdc] bg-[#ffffff] rounded-xl outline-none text-sm sm:text-base"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
                setAge(value === "" ? "" : parseInt(value));
              }}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Profile Image</Label>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex-1 border border-[#dcdcdc] bg-[#ffffff] rounded-lg">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={isLoading}
                  className="text-xs sm:text-sm"
                />
              </div>
              {uploadMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
            </div>
            {imagePreview && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-5 w-5 sm:h-6 sm:w-6 p-0 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => setImagePreview(null)}
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Register Button */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <Button
              type="button"
              onClick={registerClick}
              disabled={registerMutation.isPending}
              className="w-full p-4 sm:p-5 rounded text-sm sm:text-base"
            >
              {registerMutation.isPending ? "Registering..." : "Register"}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-3 sm:my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs sm:text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In */}
          {/* <GoogleLogin
            onSuccess={(credentialResponse) => {
              googleLogin(credentialResponse.credential || "");
            }}
            onError={() => toast.error("Google Login Failed!")}
          /> */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                let profileImageUrl = "";
                try {
                  const decoded: any = jwtDecode(
                    credentialResponse.credential || ""
                  );
                  profileImageUrl = decoded.picture || "";
                } catch (e) {
                  profileImageUrl = "";
                }
                googleLogin(credentialResponse.credential || "", profileImageUrl);
              }}
              onError={() => toast.error("Google Login Failed!")}
              size="medium"
            />
          </div>
        </form>

        {/* OTP Dialog */}
        <AlertDialog
          open={isVerificationDialogOpen}
          onOpenChange={setIsVerificationDialogOpen}
        >
          <AlertDialogContent className="max-w-xs sm:max-w-md rounded-2xl shadow-xl mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-lg sm:text-xl font-bold text-gray-800">
                Enter Verification Code
              </AlertDialogTitle>
              <p className="text-center text-xs sm:text-sm text-gray-500">
                We have sent a 6-digit OTP to your registered email.
              </p>
            </AlertDialogHeader>
            <div className="flex justify-center mt-4 sm:mt-6">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                containerClassName="gap-2 sm:gap-3"
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      className="w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg rounded-md"
                      index={i}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex justify-center mt-3 sm:mt-4">
              <Button
                className="w-[70%] sm:w-[60%] text-sm sm:text-base"
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