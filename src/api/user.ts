import axios from "axios";
import { get, getDataFromStorage, post } from "./request";

export const userRegister = post("http://localhost:3001/api/user/create");

export const userLogin = (params: any, remember: boolean = true) => {
  if (!remember) {
    // @ts-ignore
    if (!axios.__customConfig) {
      // @ts-ignore
      axios.__customConfig = {};
    }
    // @ts-ignore
    axios.__customConfig.rememberUser = remember;
  }
  return post("http://localhost:3001/api/user/login")(params);
};

// body: { token: string }
const refreshToken = () => {
  const refresh_token = getDataFromStorage("refresh_token");
  if (refresh_token) {
    return post("http://localhost:3001/api/user/refresh/token")({
      token: refresh_token,
    });
  }
};

const afterRefreshToken = (params?: any) => {
  const next = refreshToken();
  if (next) {
    return next.then(() =>
      get("http://localhost:3001/api/user/profile")(params)
    );
  } else {
    return Promise.reject(null);
  }
};

export const getProfile = (params: any) =>
  get("http://localhost:3001/api/user/profile")(params)
    .then((data: any) => {
      if (!data) {
        return afterRefreshToken();
      } else {
        return data;
      }
    })
    .catch(() => {
      return afterRefreshToken();
    });
