import { api, handleResponse, handleError } from "./apiServices";

export const getUserDashboardInvestmentData = (token, id) =>
  api(token)
    .get(
      `/api/dashboard/dashboardRoutes/getUserDashboardDatafortotalinvestment/${id}`
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDashboardTotalassetData = (token, id) =>
  api(token)
    .get(
      `/api/dashboard/dashboardRoutes/getUserDashboardDatafortotalasset/${id}`
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDashboardCurrentmonthIncomeData = (token, id) =>
  api(token)
    .get(
      `/api/dashboard/dashboardRoutes/getUserDashboardDatafortotalmonthincome/${id}`
    )
    .then(handleResponse)
    .catch(handleError);
export const getUserDashboardWalletData = (token, id) =>
  api(token)
    .get(
      `/api/dashboard/dashboardRoutes/getUserDashboardDataforwalletamount/${id}`
    )
    .then(handleResponse)
    .catch(handleError);

export const getAdminDashboardData = (token, id) =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getAdminDashboardData/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getAdminDashboardWithdrawalDataByMonth = (token, id, data) =>
  api(token)
    .post(
      `/api/dashboard/dashboardRoutes/getAdminSelectedMonthDataWithdrawalData/${id}`,
      data
    )
    .then(handleResponse)
    .catch(handleError);

export const getAdminDashboardChartData = (token, id) =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getAdminDashboardChartData/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const editAdminWalletData = (token, id, data) =>
  api(token)
    .post(`/api/dashboard/dashboardRoutes/editAdminWalletBalance/${id}`, data)
    .then(handleResponse)
    .catch(handleError);

export const getAdminPendingWithdrawalData = (token, id) =>
  api(token)
    .get(
      `/api/dashboard/dashboardRoutes/getAdminDashboardPendingWithdrawalData/${id}`
    )
    .then(handleResponse)
    .catch(handleError);

export const getUserTotalAssetForAdmin = (token, id) =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getTotalAssetForAdmin/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getAdminWalletData = (token, id) =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getAdminWalletBalance/${id}`)
    .then(handleResponse)
    .catch(handleError);

export const getUserPurchasedSubscription = token =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getUserPurchesedSubscription`)
    .then(handleResponse)
    .catch(handleError);

export const getAdminDashboardSubscriptionData = token =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getAdminDashboadSubscriptionData`)
    .then(handleResponse)
    .catch(handleError);

export const getAdminDashboardSubscription = token =>
  api(token)
    .get(`/api/dashboard/dashboardRoutes/getAdminDashboadSubscription`)
    .then(handleResponse)
    .catch(handleError);

export const getallUserApprovedSubscriptionWithoutpagination = token =>
  api(token)
    .get(
      `/api/usersubscription/usersubscription/getUserapprovedsubscriptionwithoutpagination`
    )
    .then(handleResponse)
    .catch(handleError);
