import { api, handleResponse, handleError } from "./apiServices";

export const userRegister = data =>
  api()
    .post(`/api/user/userProfile/registeruser`, data)
    .then(handleResponse)
    .catch(handleError);

export const checkOtp = data =>
  api()
    .post(`/api/user/userProfile/checkotp`, data)
    .then(handleResponse)
    .catch(handleError);

export const reSendOtp = data =>
  api()
    .post(`/api/user/userProfile/resendOtp`, data)
    .then(handleResponse)
    .catch(handleError);

export const sendOtp = data =>
  api()
    .post(`/api/user/userProfile/sendOtp`, data)
    .then(handleResponse)
    .catch(handleError);

export const userRegisterByAdmin = (token, data) =>
  api(token)
    .post(`/api/user/userProfile/registeruserbyadmin`, data)
    .then(handleResponse)
    .catch(handleError);

export const userUpdateByAdmin = (token, id, data) =>
  api(token)
    .post(`/api/user/userProfile/updateuser/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const userlist = (token, data) =>
  api(token)
    .post(`/api/user/userProfile/getalluser`, data)
    .then(handleResponse)
    .catch(handleError);

export const delteduserlist = (token, data) =>
  api(token)
    .post(`/api/user/userProfile/getdeleteduser`, data)
    .then(handleResponse)
    .catch(handleError);

export const userlistwithoutpagination = token =>
  api(token)
    .get(`/api/user/userProfile/getalluserwithoutpagination`)
    .then(handleResponse)
    .catch(handleError);

export const userStatusUpdate = (token, id, data) =>
  api(token)
    .post(`/api/user/userProfile/updateuserstatus/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteUser = (token, id) =>
  api(token)
    .delete(`/api/user/userProfile/deleteUser/${id}`)
    .then(handleResponse)
    .catch(handleError);
