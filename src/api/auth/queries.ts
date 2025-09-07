import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {
  googleLoginPayload,
  loginPayload,
  LoginResponsePayload,
  registerPayload,
  verifyEmailPayload,
} from "./type";
import AuthServices from "./services";

// export const userLogin = (
//   options?: UseMutationOptions<LoginResponse, Error, loginPayload>
// ) => {
//   return useMutation({
//     mutationKey: ["userLogin"],
//     mutationFn: AuthServices.login,
//     ...options,
//   });
// };

// export const userRegister = (
//   options?: UseMutationOptions<LoginResponse, Error, registerPayload>
// ) => {
//   return useMutation({
//     mutationKey: ["userRegister"],
//     mutationFn: AuthServices.register,
//     ...options,
//   });
// };

export const userLogin = {
  useMutation: (
    opt?: UseMutationOptions<any, Error, loginPayload, void>
  ) =>
    useMutation({
      mutationKey: ["userLogin"],
      mutationFn: (payload: loginPayload) => AuthServices.login(payload),
      ...opt,
    }),
};

export const userRegister = {
  useMutation: (opt?: UseMutationOptions<any, Error, registerPayload, void>) =>
    useMutation({
      mutationKey: ["userRegister"],
      mutationFn: (payload: registerPayload) => AuthServices.register(payload),
      ...opt,
    }),
};

export const verification = {
  useMutation: (
    opt?: UseMutationOptions<any, Error, verifyEmailPayload, void>
  ) =>
    useMutation({
      mutationKey: ["verification"],
      mutationFn: (payload: verifyEmailPayload) =>
        AuthServices.verifyEmail(payload),
      ...opt,
    }),
};

export const GoogleLoginSingup = {
  useMutation: (
    opt?: UseMutationOptions<LoginResponsePayload, Error, googleLoginPayload, void>
  ) =>
    useMutation({
      mutationKey: ["GoogleLoginSingup"],
      mutationFn: (payload: googleLoginPayload) => AuthServices.googleLoginSingup(payload),
      ...opt,
    }),
}
