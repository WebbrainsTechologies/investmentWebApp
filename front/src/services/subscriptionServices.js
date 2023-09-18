import { handleError, handleResponse, api } from "./apiServices";

export const addSubscription = (token, data) =>
  api(token)
    .post("/api/subscription/subscriptioncrud/addsubscription", data)
    .then(handleResponse)
    .catch(handleError);

export const editSubscription = (token, id, data) =>
  api(token)
    .post(`/api/subscription/subscriptioncrud/editsubscription/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const deleteSubscription = (token, id) =>
  api(token)
    .delete(`/api/subscription/subscriptioncrud/deletesubscription/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getSubscriptionList = (token, data) =>
  api(token)
    .post("/api/subscription/subscription/getallsubscription", data)
    .then(handleResponse)
    .catch(handleError);

export const getallSubscription = token =>
  api(token)
    .get("/api/subscription/subscription/getsubscriptionswithoutpagination")
    .then(handleResponse)
    .catch(handleError);

export const getallSubscriptionForSubscriberpage = token =>
  api(token)
    .get("/api/subscription/subscription/getsubscriptionlistforsubscriberpage")
    .then(handleResponse)
    .catch(handleError);

export const changeSubscriptionStatus = (token, id, data) =>
  api(token)
    .post(`/api/subscription/subscription/changesubscriptionstatus/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const getSubscriptionDetailById = (token, id) =>
  api(token)
    .post(`/api/subscription/subscription/getsubscriptionbyid/${id}`)
    .then(handleResponse)
    .catch(handleError);
