import {jwtDecode} from "jwt-decode";
import { TokenPayload } from "../types";

export const getDecodedToken = (token: string | null): TokenPayload | null => {
  if (!token) return null;
  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string | null): boolean => {
  const decoded = getDecodedToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};
