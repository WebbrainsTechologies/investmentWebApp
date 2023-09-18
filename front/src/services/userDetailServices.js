import { api, handleResponse, handleError } from "./apiServices";

export const getUserDetailInvestmentData = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserDetailDatafortotalinvestment/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getUserDetailTotalAsset = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserDetailDatafortotalAsset/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDetailWithdrawalData = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserDetailDataforwithdrawal/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDetailRoiAndCommision = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserDetailDataforroiandcommision/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDetailWalletData = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserDetailDataforwalletamount/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getallUserApprovedSubscriptionWithoutpaginationByUserId = (
  token,
  id
) =>
  api(token)
    .get(
      `/api/userdetails/userDetailRoutes/getUserapprovedsubscriptionwithoutpagination/${id}`
    )
    .then(handleResponse)
    .catch(handleError);

export const getUserFuturePayoutByuserId = (token, id, data) =>
  api(token)
    .post(
      `/api/userdetails/userDetailRoutes/getUserFuturPayoutByuserId/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const viewUserByID = (token, id) =>
  api(token)
    .get(`/api/user/userProfile/viewuser/${id}`)
    .then(handleResponse)
    .catch(handleError);
