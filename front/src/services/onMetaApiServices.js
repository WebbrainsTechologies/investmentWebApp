import axios from "axios";

const BACKEND_URI = process.env.REACT_APP_ONMETA_URI
  ? process.env.REACT_APP_ONMETA_URI
  : "";

const onmetaapikey = process.env.REACT_APP_ONMETA_X_API_KEY
  ? process.env.REACT_APP_ONMETA_X_API_KEY
  : "";
export const api = token => {
  if (typeof token === "string")
    return axios.create({
      // withCredentials: true,
      baseURL: `${BACKEND_URI}/`,
      headers: {
        Accept: "application/json",
        "x-api-key": onmetaapikey,
        Authorization: `Bearer ${token}`
      }
    });
  else
    return axios.create({
      // withCredentials: true,
      baseURL: `${BACKEND_URI}/`,
      headers: {
        Accept: "application/json",
        "x-api-key": onmetaapikey
      }
    });
};

export const handleResponse = res => {
  try {
    const data = res.data;
    if (!data.success) {
      const error = data.message ? data.message : data.error;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handleError = err => {
  console.log(err, "checkerror38");
  // console.log("err.response.status",err.response.status)
  // if (err.error?.code === 401) {
  //   console.log(err, "checkerror40");
  // }
  return err?.response?.data ? err?.response?.data : err;
};
