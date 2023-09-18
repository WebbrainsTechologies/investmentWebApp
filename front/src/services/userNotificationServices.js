import { api, handleResponse, handleError } from "./apiServices";

export const getUserAllNotifications = (token, params) =>
  api(token)
    .post(`/api/notification/notificationapi/getadminusernotification`, params)
    .then(handleResponse)
    .catch(handleError);

export const markUserNoticationsRead = token =>
  api(token)
    .post(`/api/notification/notificationapi/adminusernotification/mark/read`)
    .then(handleResponse)
    .catch(handleError);

export const markEscalatNotificationReadById = (token, id) =>
  api(token)
    .post(
      `/api/notification/notificationapi/adminusernotification/mark/read/${id}`
    )
    .then(handleResponse)
    .catch(handleError);

export const deleteUserNotificationById = (token, id) =>
  api(token)
    .delete(
      `/api/notification/notificationapi/adminusernotification/delete/${id}`
    )
    .then(handleResponse)
    .catch(handleError);

export const unreadNotificationsCount = token =>
  api(token)
    .get(
      `/api/notification/notificationapi/getadminusernotification/unread/count`
    )
    .then(handleResponse)
    .catch(handleError);
