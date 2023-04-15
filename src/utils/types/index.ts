export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TResponse = {
  success: boolean;
  message?: unknown;
  data?: unknown;
};
