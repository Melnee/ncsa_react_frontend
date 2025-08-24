// api.js
import axios from "axios";

export const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosInstance = axios.create({});

export const MakeBackendRequest = ({
  urlSuffix,
  method = "GET",
  data,
  headers = defaultHeaders,
  queryParamsObject,
}) => {
  const base = import.meta.env.VITE_BACKEND_URL;
  let url = `${base}${urlSuffix}`;

  if (queryParamsObject) {
    const query = Object.entries(queryParamsObject)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    url += `?${query}`;
  }

  return axiosInstance({ url, method, data, headers });
};
