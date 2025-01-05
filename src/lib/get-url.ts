export const getBaseUrl = () => {
  return process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BASE_URL!
    : process.env.NEXT_PUBLIC_LOCAL_URL!;
};
