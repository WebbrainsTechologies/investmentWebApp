import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./Enhancer/EditSubscriberStatusEnhancer";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";

const { success, error, fetching, getNotificationData } = NavigationActions;

const EditSubscriberStatusModal = props => {
  const {
    token,
    onClose,
    editData,
    setValues,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    submitCount,
    isValid,
    handleSubmit,
    handleClear,
    isApproved,
    getNotificationData,
    toggleRefresh
  } = props;
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);

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
    if (editData) {
      // console.log(
      //   "edit data",
      //   editData,
      //   values,
      //   editData.usersubscriptionstatus
      // );
      setValues({
        ...values,
        userId: editData.userId._id,
        usersubscriptionstatus:
          editData.usersubscriptionstatus === "Pending"
            ? ""
            : editData.usersubscriptionstatus,
        notificationId: editData.notificationId,
        remark: editData.remark
      });
    }
  }, []);

  const updateStatus = async () => {
    fetching();
    handleSubmit();
    if (isValid) {
      await changeSubscriberSubscriptionStatus(
        token,
        editData._id,
        values
      ).then(data => {
        if (data.success) {
          success(data.message);
          setSubmitDisabled(false);
          getNotificationData(token);
          onClose();
          toggleRefresh(true);
        } else {
          error(data.message);
          setSubmitDisabled(false);
          onClose();
        }
      });
    }
    setSubmitDisabled(false);
  };

  return (
    <>
      <div className="row px-2 py-4 mx-0">
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>User Name</label>
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
        </div>
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={`${editData.amount}   ${editData.currency}`}
              placeholder={"amount"}
              disabled
              readOnly
            />
          </div>
        </div>

        <div className="col-12 mb-4">
          <p>Image </p>
          {editData?.manual_purchase_image ? (
            <a
              href={`${process.env.REACT_APP_UPLOAD_DIR}${editData?.manual_purchase_image}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${process.env.REACT_APP_UPLOAD_DIR}${editData?.manual_purchase_image}`}
                className="manual-payment-image"
                alt="no"
              />
            </a>
          ) : null}
        </div>
        <div className="col-12 mb-2">
          <label htmlFor="status">status</label>
          {values?.usersubscriptionstatus === "Closed" ||
          values?.usersubscriptionstatus === "Cancelled" ? (
            <input
              type="text"
              className="form-control react-form-input"
              id="usersubscriptionstatus"
              value={values.usersubscriptionstatus}
              placeholder={"Status"}
              disabled
              readOnly
            />
          ) : (
            <>
              <select
                name="usersubscriptionstatus"
                id="usersubscriptionstatus"
                disabled={isApproved}
                value={values.usersubscriptionstatus}
                onChange={e => {
                  setValues({
                    ...values,
                    usersubscriptionstatus: e.target.value
                  });
                }}
                className="custom-select"
              >
                <option value={""} hidden>
                  Pending
                </option>
                <option value={"Accepted"}>Accept</option>
                <option value={"Rejected"}>Reject</option>
              </select>
              <Error field="usersubscriptionstatus" />
            </>
          )}
        </div>

        {values.usersubscriptionstatus === "Rejected" ? (
          <div className="col-12">
            <div className="form-group">
              <label>
                Remark <span className="text-danger">*</span>
              </label>
              <textarea
                name="remark"
                id="remark"
                disabled={isApproved}
                className="form-control"
                placeholder="Enter Remark"
                defaultValue={values.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                cols={10}
                rows={3}
              />
              <Error field="remark" />
            </div>
          </div>
        ) : null}
        <div className="col-12 mt-3">
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
                disabled={isSubmitDisabled || isApproved}
                onClick={() => {
                  setSubmitDisabled(true);
                  updateStatus();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
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
)(EditSubscriberStatusModal);
