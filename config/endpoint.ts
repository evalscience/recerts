const production = "https://ecocertain.xyz";
const development = "https://testnet.ecocertain.xyz";
const localhost = "http://localhost:3000";

export const getEcocertainUrl = () => {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
    return production;
  } else if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "development") {
    return development;
  } else {
    return localhost;
  }
};

export const getEcocertainApiUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return localhost;
  }
  return getEcocertainUrl();
};
