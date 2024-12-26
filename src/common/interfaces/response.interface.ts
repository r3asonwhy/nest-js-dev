export interface IResponse<T> {
  success: boolean;
  data: T;
  [key: string]: unknown;
}
