export type loginPayload = {
    email: string
    password: string
}

export type registerPayload = {
  email: string
  password: string
  userName: string
  age: number
  profileImageUrl: string
}

export type verifyEmailPayload = {
  email: string
  otp: string
}

export type googleLoginPayload = {
  token: string
  ProfileImageUrl: string
}

export type LoginResponsePayload = {
  token: string;
  userName: string;
  roleName: string;
}