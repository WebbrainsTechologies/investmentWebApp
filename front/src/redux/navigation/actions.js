import { toast } from "react-toastify";
import { getKycByUserId } from "services/kycServices";
// import { getAllDetailsFinishSetup } from "services/finishSetupByUserServices";
// import { GetGroupStatusHirarchy } from "services/groupsServices";
import { unreadNotificationsCount } from "services/userNotificationServices";

const navigationAction = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  CLOSE: "CLOSE",
  FETCHING: "FETCHING",
  ONETIMEMODAL: "ONETIMEMODAL",
  TOGGLEMODAL: "TOGGLEMODAL",
  TOGGLETAB: "TOGGLETAB",
  GROUPSTATUSDATA: "GROUPSTATUSDATA",
  NOTIFICATIONDATA: "NOTIFICATIONDATA",
  SUBSCRIPTIONSUCCESS: "SUBSCRIPTIONSUCCESS",
  ONBOARDINGTOGGLEMODAL: "ONBOARDINGTOGGLEMODAL",
  FINISHSETUPDATA: "FINISHSETUPDATA",
  KYCSTATUS: "KYCSTATUS",
  SETWALLETVALUE: "SETWALLETVALUE",

  success: messages => {
    messages !== "" &&
      toast.success(messages, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    return {
      type: navigationAction.SUCCESS,
      resType: "success",
      message: messages,
      show: true,
      isFetching: false
    };
  },
  error: messages => {
    messages !== "" &&
      toast.error(messages, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    return {
      type: navigationAction.ERROR,
      resType: "error",
      message: messages,
      show: true,
      isFetching: false
    };
  },
  close: () => {
    return {
      type: navigationAction.CLOSE,
      show: false,
      isFetching: false
    };
  },
  fetching: () => ({
    type: navigationAction.FETCHING,
    isFetching: true
  }),

  toggleSubscriptionLoader: value => {
    return {
      type: navigationAction.SUBSCRIPTIONSUCCESS,
      isSubscriptionSuccess: value
    };
  },

  toggleSubscribeModal: value => {
    return {
      type: navigationAction.TOGGLEMODAL,
      subscription: value
    };
  },

  toggleOneTimeModal: value => {
    return {
      type: navigationAction.ONETIMEMODAL,
      oneTimeModal: value
    };
  },
  // getGroupStatusData: token => async dispatch => {
  //   try {
  //     var sideBarData = [];
  //     await GetGroupStatusHirarchy(token).then(data => {
  //       if (data.success) {
  //         sideBarData = data.data;
  //         return dispatch({
  //           type: navigationAction.GROUPSTATUSDATA,
  //           workflowData: sideBarData
  //         });
  //       } else {
  //         return dispatch({
  //           type: navigationAction.GROUPSTATUSDATA,
  //           workflowData: sideBarData
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     return dispatch({
  //       type: navigationAction.GROUPSTATUSDATA,
  //       workflowData: sideBarData
  //     });
  //   }
  // },

  getNotificationData: token => async dispatch => {
    try {
      var notificationData = [];

      await unreadNotificationsCount(token).then(data => {
        if (data.success) {
          notificationData = data.data;
          return dispatch({
            type: navigationAction.NOTIFICATIONDATA,
            notificationData: notificationData
          });
        } else {
          return dispatch({
            type: navigationAction.NOTIFICATIONDATA,
            notificationData: notificationData
          });
        }
      });
    } catch (err) {
      return dispatch({
        type: navigationAction.NOTIFICATIONDATA,
        notificationData: notificationData
      });
    }
  },

  getKycStatus: (token, id) => async dispatch => {
    try {
      var kycStatus;

      await getKycByUserId(token, id).then(data => {
        if (data.success) {
          kycStatus = data.data?.is_verified ? data.data?.is_verified : false;
          // console.log(kycStatus, "check149", data.data);
          return dispatch({
            type: navigationAction.KYCSTATUS,
            kycStatus: kycStatus
          });
        } else {
          return dispatch({
            type: navigationAction.KYCSTATUS,
            kycStatus: kycStatus
          });
        }
      });
    } catch (err) {
      return dispatch({
        type: navigationAction.KYCSTATUS,
        kycStatus: kycStatus
      });
    }
  },

  toggleONboardingDataModal: value => {
    return {
      type: navigationAction.ONBOARDINGTOGGLEMODAL,
      onboardingModal: value
    };
  },
  setWalletValue: value => {
    return {
      type: navigationAction.SETWALLETVALUE,
      walletValue: value
    };
  }

  // getFinishSetUpData: token => async dispatch => {
  //   try {
  //     var finishSetUpData = [];

  //     await getAllDetailsFinishSetup(token).then(data => {
  //       if (data.success) {
  //         finishSetUpData = data.data;
  //         return dispatch({
  //           type: navigationAction.FINISHSETUPDATA,
  //           finishSetUpData: finishSetUpData
  //         });
  //       } else {
  //         return dispatch({
  //           type: navigationAction.FINISHSETUPDATA,
  //           finishSetUpData: finishSetUpData
  //         });
  //       }
  //     });
  //   } catch (err) {
  //     return dispatch({
  //       type: navigationAction.FINISHSETUPDATA,
  //       finishSetUpData: finishSetUpData
  //     });
  //   }
  // }
};
// export const

export default navigationAction;
