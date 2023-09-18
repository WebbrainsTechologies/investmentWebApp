import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
// import enhancer from "./enhancer/Changewalletwithdrawalrequestenhancer";
import detail_img from "../../../assets/images/alert-icon.svg";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";
import { XCircle } from "react-feather";
import { changeWithdrawalRequestStatus } from "services/withdrawalServices";

const { success, error, fetching, getNotificationData } = NavigationActions;

const UserWithdrawalRequestDetails = props => {
  const { onClose, editData } = props;

  // const [btnDisable, setBtnDisable] = useState(false);

  //   const updateStatus = async () => {
  //     // setBtnDisable(true);
  //     fetching();
  //     if (isValid) {
  //       handleSubmit();
  //       let formData = new FormData();
  //       formData.append("status", values.status);
  //       formData.append("notificationId", values.notificationId);
  //       formData.append("remark", values.remark);
  //       formData.append("withdrawal_file", values.withdrawal_file);
  //       formData.append("userId", editData?.userId?._id);
  //       await changeWithdrawalRequestStatus(token, editData?._id, formData).then(
  //         (data) => {
  //           if (data.success) {
  //             success(data.message);
  //             onClose();
  //             getNotificationData(token);
  //             // setBtnDisable(false);
  //           } else {
  //             error(data.message);
  //             onClose();
  //             // setBtnDisable(false);
  //           }
  //         }
  //       );
  //     }
  //   };
  // console.log(editData, "checkeditData");
  return (
    <>
      <div className="row px-2 py-4 mx-0">
        {/* <div className="col-12 mb-2">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="name"
              value={editData?.userId?.name}
              placeholder={"Name"}
              disabled
              readOnly
            />
          </div>
        </div> */}
        <div className="col-12 text-right cursor-pointer">
          <XCircle
            onClick={() => {
              onClose();
            }}
          />
        </div>
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={editData?.amount + editData?.currencyId?.name}
              placeholder={"amount"}
              disabled
              readOnly
            />
          </div>
        </div>
        {editData?.withdrawal_type === "manual" ? (
          <>
            <div className="col-12 mb-2">
              <div className="form-group">
                <label>Network Type</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="amount"
                  value={editData?.network_type}
                  placeholder={"amount"}
                  disabled
                  readOnly
                />
              </div>
            </div>
            <div className="col-12 mb-2">
              <div className="form-group">
                <label>Wallet Address</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="amount"
                  value={editData?.walletAddress}
                  placeholder={"amount"}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Status</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={editData?.status}
              placeholder={"status"}
              disabled
              readOnly
            />
          </div>
        </div>
        {editData.status === "Accepted" && (
          <div className="col-12">
            <a
              href={`${process.env.REACT_APP_UPLOAD_DIR}${editData?.withdrawal_file}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${process.env.REACT_APP_UPLOAD_DIR}${editData?.withdrawal_file}`}
                className="manual-payment-image"
                alt="no"
              />
            </a>
          </div>
        )}
        {editData.withdrawal_type === "manual" && (
          <div className="col-12">
            <div className="form-group">
              <label>Remark</label>
              <textarea
                name="remark"
                id="remark"
                className="form-control"
                placeholder="Remark"
                defaultValue={editData?.remark}
                disabled
                readOnly
                cols={10}
                rows={3}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};
export default compose(
  withRouter,
  //   enhancer,
  connect(mapStateToProps, { success, error, fetching, getNotificationData })
)(UserWithdrawalRequestDetails);
