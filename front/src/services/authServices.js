import { api, handleResponse, handleError } from "./apiServices";

export const loginApi = data =>
  api()
    .post("/api/admin/auth/adminuserlogin", data)
    .then(handleResponse)
    .catch(handleError);

export const logoutApi = token =>
  api(token)
    .get("/api/admin/auth/adminuserlogout")
    .then(handleResponse)
    .catch(handleError);

export const checkApi = (token, data) =>
  api(token, data)
    .post("/api/admin/auth/adminusercheck")
    .then(handleResponse)
    .catch(handleError);
// export const checkApi = token =>
//   api(token)
//     .get("/auth/check")
//     .then(handleResponse)
//     .catch(handleError);

// export const forgotPassword = data =>
//   api()
//     .post("/auth/forgot-password", data)
//     .then(handleResponse)
//     .catch(handleError);

// export const resetPassword = (data, token) =>
//   api()
//     .put(`/auth/reset-password/${token}`, data)
//     .then(handleResponse)
//     .catch(handleError);

// export const register = data =>
//   api()
//     .post("/auth/register", data)
//     .then(handleResponse)
//     .catch(handleError);

// export const LoginUsingId = id =>
//   api()
//     .get("/auth/login_as/" + id)
//     .then(handleResponse)
//     .catch(handleError);

// export const TermsAndCondition = () =>
//   api()
//     .get("/settings/get-terms-and-condition")
//     .then(handleResponse)
//     .catch(handleError);
