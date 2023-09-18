import { handleError, handleResponse, api } from "./apiServices";

export const addUserWithdrawalRequest = (token, data) =>
  api(token)
    .post(`/api/userwithdrawal/withdrawal/addwithdrawalrequest`, data)
    .then(handleResponse)
    .catch(handleError);
export const changeWithdrawalRequestStatus = (token, id, data) =>
  api(token)
    .post(
      `/api/userwithdrawal/withdrawal/changewithdrawalrequeststatus/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const walletWithdrawalrequestforadmin = (token, data) =>
  api(token)
    .post(
      `/api/userwithdrawal/withdrawal/getallwithdrawalrequestsforadmin`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const walletWithdrawalrequestforuser = (token, data) =>
  api(token)
    .post(
      `/api/userwithdrawal/withdrawal/getallwithdrawalrequestsforuser`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const checkpendingwithdrawal = (token, data) =>
  api(token)
    .post(`/api/userwithdrawal/withdrawal/checkpendingwithdrawal`, data)
    .then(handleResponse)
    .catch(handleError);
export const getCommisionPayout = (token, data) =>
  api(token)
    .post(`/api/transaction/transactionapi/get-commision-payout`, data)
    .then(handleResponse)
    .catch(handleError);
