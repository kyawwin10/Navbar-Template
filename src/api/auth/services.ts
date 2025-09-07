import toast from "react-hot-toast";
import { axiosInstance } from "../axiosInstance";
import type { googleLoginPayload, loginPayload, LoginResponsePayload, registerPayload, verifyEmailPayload } from "./type";

const baseURL = '/api/User'

const login = async (payload: loginPayload) => {
    const request = await axiosInstance.post(`${baseURL}/login`, payload);
    console.log("Login:", request);
    return request.data;
}

const register = async (payload: registerPayload) => {
    const response = await axiosInstance.post(`${baseURL}/register`, payload);
    return response.data;
}

const verifyEmail = async (payload: verifyEmailPayload) => {
    const response = await axiosInstance.post(`${baseURL}/verify-email`, payload);
    return response.data;
}

const googleLoginSingup = async (payload: googleLoginPayload) : Promise<LoginResponsePayload> => {
    const response = await axiosInstance.post(`${baseURL}/google-login`, payload);
    toast.success("Google Login Successfully");
    return response.data;
}

export default {login, register, verifyEmail, googleLoginSingup}