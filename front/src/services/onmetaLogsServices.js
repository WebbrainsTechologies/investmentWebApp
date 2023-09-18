import { handleError, handleResponse, api } from "./apiServices";

export const addonmetaLogs = (token, data) =>
  api(token)
    .post(`/api/onmetalogs/onmetalogs/addonmetalogs`, data)
    .then(handleResponse)
    .catch(handleError);
