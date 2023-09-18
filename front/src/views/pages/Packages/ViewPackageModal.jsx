import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import enhancer from "../Subscriber/Enhancer/EditSubscriberStatusEnhancer";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";
import { XCircle } from "react-feather";

const { success, error, fetching, getNotificationData } = NavigationActions;

const ViewPackageModal = props => {
  const {
    token,
    onClose,
    viewData,
    setValues,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    submitCount
  } = props;

  // console.log("view data", viewData);

  const Error = props => {
    const field1 = props.field;
    if ((errors[field1] && touched[field1]) || submitCount > 0) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors[field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };
  useEffect(() => {
    if (viewData) {
      setValues({
        ...values,
        userId: viewData.userId._id
      });
    }
  }, []);

  return (
    <>
      <div className="row px-2 py-4 mx-0">
        <div className="col-12 text-right cursor-pointer">
          <XCircle
            onClick={() => {
              onClose();
            }}
          />
        </div>
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="name"
              value={viewData?.name}
              placeholder={"Name"}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={`${viewData.amount}   ${viewData.currency}`}
              placeholder={"amount"}
              disabled
              readOnly
            />
          </div>
        </div>
        {viewData?.investment_type === "manually" ? (
          <div className="col-12 mb-4">
            <p>Image </p>
            {viewData?.manual_purchase_image ? (
              <a
                href={`${process.env.REACT_APP_UPLOAD_DIR}${viewData?.manual_purchase_image}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`${process.env.REACT_APP_UPLOAD_DIR}${viewData?.manual_purchase_image}`}
                  className="manual-payment-image"
                  alt="no"
                />
              </a>
            ) : null}
          </div>
        ) : null}
        {viewData?.usersubscriptionstatus === "Closed" ||
        viewData?.usersubscriptionstatus === "Cancelled" ? (
          <div className="col-12 mb-2">
            <div className="form-group">
              <label>Status</label>
              <input
                type="text"
                className="form-control react-form-input"
                id="status"
                value={viewData.usersubscriptionstatus}
                placeholder={"status"}
                disabled
                readOnly
              />
            </div>
          </div>
        ) : (
          <div className="col-12 mb-2">
            <label htmlFor="Status">Status</label>
            <select
              name="status"
              id="status"
              defaultValue={viewData.usersubscriptionstatus}
              disabled={true}
              className="custom-select"
            >
              <option value={""} hidden>
                Pending
              </option>
              <option value={"Accepted"}>Accept</option>
              <option value={"Rejected"}>Reject</option>
            </select>
            <Error field="status" />
          </div>
        )}

        {viewData.usersubscriptionstatus === "Rejected" ? (
          <div className="col-12">
            <div className="form-group">
              <label>Remark</label>
              <textarea
                name="remark"
                id="remark"
                disabled
                className="form-control"
                placeholder="Enter Remark"
                defaultValue={viewData.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                cols={10}
                rows={3}
              />
              <Error field="remark" />
            </div>
          </div>
        ) : null}
        {/* <div className="col-12 mt-3">
          <div className="row justify-content-center">
            <div className="col-auto">
              <button
                className="btn form-button modalcancelbutton"
                style={{ fontSize: "18px" }}
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-blue"
                // disabled={btnDisable}
                disabled={!isValid}
                onClick={() => {
                  updateStatus();
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div> */}
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
  enhancer,
  connect(mapStateToProps, { success, error, fetching, getNotificationData })
)(ViewPackageModal);
