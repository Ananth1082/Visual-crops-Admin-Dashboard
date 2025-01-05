import jwt from "jsonwebtoken";

export const isJwtExpired = (token: string) => {
  const currentTime = Math.floor(Date.now() / 1000) + 60;
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && decoded?.exp) {
    const adjustedExpiry = decoded.exp;
    return adjustedExpiry < currentTime;
  }
  return true;
};

export const getRefreshTokenExpiry = (token: string) => {
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === "object" && decoded?.exp) {
    const adjustedExpiry = decoded.exp;
    return adjustedExpiry;
  }
  return 0;
};
