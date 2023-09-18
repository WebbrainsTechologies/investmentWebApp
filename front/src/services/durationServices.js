import { handleError, handleResponse, api } from "./apiServices";

export const addDuration = (token, data) =>
  api(token)
    .post("/api/duration/durationcrud/addduration", data)
    .then(handleResponse)
    .catch(handleError);

export const editDuration = (token, id, data) =>
  api(token)
    .post(`/api/duration/durationcrud/editduration/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteDuration = (token, id) =>
  api(token)
    .delete(`/api/duration/durationcrud/deleteduration/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getDurationList = (token, data) =>
  api(token)
    .post("/api/duration/duration/getallduration", data)
    .then(handleResponse)
    .catch(handleError);

export const changeDurationStatus = (token, id, data) =>
  api(token)
    .post(`/api/duration/duration/changedurationstatus/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const getallDuration = (token, data) =>
  api(token)
    .get("/api/duration/duration/getalldurationwithoutpagination", data)
    .then(handleResponse)
    .catch(handleError);
