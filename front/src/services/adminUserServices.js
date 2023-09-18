import { api, handleResponse, handleError } from "./apiServices";

export const get_superadmin_profile = token =>
  api(token)
    .get("/api/admin/adminProfile/profile")
    .then(handleResponse)
    .catch(handleError);

export const update_admin_profile = (token, data) =>
  api(token)
    .put("/api/admin/adminProfile/editprofile", data)
    .then(handleResponse)
    .catch(handleError);

export const change_password = (token, id, data) =>
  api(token)
    .post(`/api/admin/auth/adminuserchange-password`, data)
    .then(handleResponse)
    .catch(handleError);

export const resetPassword = data =>
  api()
    .post(`/api/admin/auth/adminuserresetpassword`, data)
    .then(handleResponse)
    .catch(handleError);

export const forgotPassword = data =>
  api()
    .post("/api/admin/auth/adminuserforgetpassword", data)
    .then(handleResponse)
    .catch(handleError);
