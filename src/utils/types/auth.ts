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
  displayName: string;
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
