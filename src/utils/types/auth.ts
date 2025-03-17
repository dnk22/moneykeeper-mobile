export type TLogin = {
  email: string;
  password: string;
};
export type TLoginResponse = {
  token: string;
  user: TUser;
};
export type TUser = {
  id: string;
  email: string;
  name: string;
  avatar: string;
};
export type TRegister = {
  email: string;
  password: string;
  name: string;
};
export type TRegisterResponse = {
  token: string;
  user: TUser;
};
export type TForgotPassword = {
  email: string;
};
export type TForgotPasswordResponse = {
  message: string;
};
export type TResetPassword = {
  password: string;
  confirmPassword: string;
};
export type TResetPasswordResponse = {
  message: string;
};
export type TUpdateProfile = {
  name: string;
  avatar: string;
};
export type TUpdateProfileResponse = {
  user: TUser;
};
export type TUpdatePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export type TUpdatePasswordResponse = {
  message: string;
};
export type TLogoutResponse = {
  message: string;
};
export type TGoogleLoginResponse = {
  token: string;
  user: TUser;
};
export type TGoogleLogin = {
  idToken: string;
};
export type TGoogleRegister = {
  idToken: string;
  name: string;
};
export type TGoogleRegisterResponse = {
  token: string;
  user: TUser;
};
export type TGoogleLink = {
  idToken: string;
};
export type TGoogleLinkResponse = {
  user: TUser;
};
export type TGoogleUnlinkResponse = {
  message: string;
};
export type TGoogleUnlink = {
  id: string;
};
