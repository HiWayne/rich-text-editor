import axios from "axios";
import { notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default async function request(options) {
  let response;
  try {
    response = await axios(options);
    return response;
  } catch (err) {
    return response;
  }
}

const handleError = (message) => {
  notification.open({
    message,
    icon: <CloseOutlined style={{ color: "red" }} />,
  });
};

axios.interceptors.request.use((request) => {
  const access_token = window.localStorage.getItem("access_token");
  if (access_token) {
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
          if (access_token) {
            window.localStorage.setItem("access_token", access_token);
          }
          if (refresh_token) {
            window.localStorage.setItem("refresh_token", refresh_token);
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

const _get = (url, params, config) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params, config })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const _post = (url, data, config) => {
  const defaultConfig = {
    credentials: "include",
  };
  const newConfig = { ...defaultConfig, ...config };
  newConfig.headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    ...newConfig.headers,
  };

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

const _delete = (url, params, config) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, { params, config })
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const createFetch = (method) => (url) => (params) => method(url, params);

export const get = createFetch(_get);
export const post = createFetch(_post);
export const Delete = createFetch(_delete);
