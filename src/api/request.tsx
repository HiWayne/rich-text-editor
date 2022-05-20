import axios, { AxiosRequestConfig } from "axios";
import { notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const handleError = (message: string) => {
  notification.open({
    message,
    icon: <CloseOutlined style={{ color: "red" }} />,
  });
};

export const getDataFromStorage = (key: string) => {
  const localStorageValue = window.localStorage.getItem(key);
  if (localStorageValue !== undefined) {
    return localStorageValue;
  } else {
    return window.sessionStorage.getItem(key);
  }
};

axios.interceptors.request.use((request) => {
  const access_token = getDataFromStorage("access_token");
  if (access_token) {
    // @ts-ignore
    request.headers["token"] = access_token;
  }
  return request;
});

axios.interceptors.response.use(
  (response) => {
    const { status, data } = response;

    if (status == 200 || status == 201) {
      if (data.status === 1) {
        const neededData = data.data;
        if (neededData) {
          const { access_token, refresh_token } = neededData;
          // @ts-ignore
          if (!axios.__customConfig || axios.__customConfig.rememberUser) {
            if (access_token) {
              window.localStorage.setItem("access_token", access_token);
            }
            if (refresh_token) {
              window.localStorage.setItem("refresh_token", refresh_token);
            }
          } else {
            if (access_token) {
              window.sessionStorage.setItem("access_token", access_token);
            }
            if (refresh_token) {
              window.sessionStorage.setItem("refresh_token", refresh_token);
            }
          }
        }
        return Promise.resolve(data);
      } else {
        handleError(data.message);
        return Promise.reject(data);
      }
    } else {
      handleError(data.message || `network ${status}`);
      return Promise.reject(data);
    }
  },
  (error) => {
    if (error.response) {
      handleError(error.response.data.message);
    } else {
      handleError(error.message);
    }
    return Promise.reject(error);
  }
);

type RequestFunc = (
  url: string,
  params: any,
  config?: AxiosRequestConfig<any>
) => Promise<any>;

const _get: RequestFunc = (url, params, config) => {
  return new Promise((resolve, reject) => {
    axios
      // @ts-ignore
      .get(url, { params, config })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const _post: RequestFunc = (url, data, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };
  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

  // @ts-ignore
  if (config && config.useJSON) {
    data = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    axios
      .post(url, data, newConfig)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const _delete: RequestFunc = (url, params, config) => {
  return new Promise((resolve, reject) => {
    axios
      // @ts-ignore
      .delete(url, { params, config })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const createFetch = (method: RequestFunc) => (url: string) => (params: any) =>
  method(url, params);

export const get = createFetch(_get);
export const post = createFetch(_post);
export const Delete = createFetch(_delete);
