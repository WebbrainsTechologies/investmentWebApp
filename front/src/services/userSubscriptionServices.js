import { handleError, handleResponse, api } from "./apiServices";

export const addUserSubscription = (token, id, data) =>
  api(token)
    .post(`/api/usersubscription/usersubscription/addinvestment/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

// export const addUserSubscription = (token, id) =>
//   api(token)
//     .get(`/api/usersubscription/usersubscription/addinvestment/${id}`)
//     .then(handleResponse)
//     .catch(handleError);

export const changeSubscriberSubscriptionStatus = (token, id, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/changesubscribersubscriptionstatus/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const userApprovedRejectdSubscription = (token, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/getUserapprovedrejectsubscription`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getSubscriberSubscription = (token, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/getallsubscribersubscription`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getUserTransectionList = (token, data) =>
  api(token)
    .post(`/api/transaction/transactionapi/getallusertransaction`, data)
    .then(handleResponse)
    .catch(handleError);

export const getAdminTransectionList = (token, data) =>
  api(token)
    .post(`/api/transaction/transactionapi/getalladmintransaction`, data)
    .then(handleResponse)
    .catch(handleError);

export const getallUserApprovedSubscription = (token, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/getUserApprovedSubscription`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getallWithdrawalRequest = (token, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/getallwithdrawalrequest`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const userWithdrawalRequest = (token, id, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/changeWithdrawalRequest/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const adminChangeWithdrawalRequest = (token, id, data) =>
  api(token)
    .post(
      `/api/usersubscription/usersubscription/changeWithdrawalrequestbyadmin/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);
