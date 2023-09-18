import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/Changewalletwithdrawalrequestenhancer";
import detail_img from "../../../assets/images/alert-icon.svg";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";
import { XCircle } from "react-feather";
import { changeWithdrawalRequestStatus } from "services/withdrawalServices";

const { success, error, fetching, getNotificationData } = NavigationActions;

const Changewalletwithdrawalrequeststatus = props => {
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
    getNotificationData,
    isApproved
  } = props;

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

  const [btnDisable, setBtnDisable] = useState(false);
  // console.log(editData, "check45");

  const updateStatus = async () => {
    setBtnDisable(true);
    fetching();
    if (isValid) {
      handleSubmit();
      let formData = new FormData();
      formData.append("status", values.status);
      formData.append("notificationId", values.notificationId);
      formData.append("remark", values.remark);
      formData.append("withdrawal_file", values.withdrawal_file);
      formData.append("userId", editData?.userId?._id);
      await changeWithdrawalRequestStatus(token, editData?._id, formData).then(
        data => {
          if (data.success) {
            success(data.message);
            onClose();
            getNotificationData(token);
            setBtnDisable(false);
          } else {
            error(data.message);
            onClose();
            setBtnDisable(false);
          }
        }
      );
    }
  };

  useEffect(() => {
    setValues({
      ...values,
      ...editData,
      current_file: null,
      status: editData?.status === "Pending" ? "" : editData?.status
    });
  }, []);

  // console.log(values, "cehckvalues65", errors);
  return (
    <>
      <div className="row px-2 py-4 mx-0">
        <div className="col-12 mb-2">
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
        <div className="col-12 mb-2">
          <select
            name="status"
            id="status"
            defaultValue={""}
            disabled={isApproved}
            onChange={e => {
              setValues({ ...values, status: e.target.value });
            }}
            value={values.status}
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
        {values.status === "Accepted" && (
          <div className="col-12">
            {!isApproved && (
              <input
                type="file"
                id="withdrawal_file "
                accept=".jpg,.png,.jpeg,.svg"
                className="mr-2 mt-4 mb-3 p-2"
                // value={values.profile_img}
                onBlur={handleBlur}
                onChange={e => {
                  if (e.target.files[0]) {
                    // console.log(e.target.files[0], "file check");
                    if (
                      ["png", "jpg", "jpeg"].includes(
                        e.target.files[0]?.type.split("/")[1]
                      )
                    ) {
                      setValues({
                        ...values,
                        current_file: URL.createObjectURL(e.target.files[0]),
                        withdrawal_file: e.target.files[0]
                      });
                    } else {
                      error(
                        "This file format is not accepted. You can upload only JPEG, JPG, and PNG Files"
                      );
                    }
                  }
                }}
              />
            )}
            <p></p>
            {((touched.withdrawal_file || touched.current_file) &&
              errors["withdrawal_file"]) ||
            errors["current_file"] ? (
              <span className="text-danger">{errors.withdrawal_file}</span>
            ) : null}
            {values.withdrawal_file !== "" && (
              <div>
                <img
                  src={
                    values.current_file === null
                      ? `${process.env.REACT_APP_UPLOAD_DIR}${values.withdrawal_file}`
                      : values.current_file
                  }
                  className="manual-payment-image"
                  alt="no"
                />
              </div>
            )}
            {values.withdrawal_file ? (
              <label
                className="blue-link cursor trash-button"
                htmlFor="withdrawal_file"
                // onClick={this.uploadImg}
              >
                {!isApproved && (
                  <XCircle
                    onClick={() => {
                      setValues({
                        ...values,
                        withdrawal_file: "",
                        current_file: ""
                      });
                    }}
                  />
                )}
              </label>
            ) : null}
          </div>
        )}

        <div className="col-12">
          <div className="form-group">
            <label>Remark</label>
            <textarea
              name="remark"
              id="remark"
              className="form-control"
              placeholder="Enter Remark"
              disabled={isApproved}
              defaultValue={values.remark}
              onChange={handleChange}
              onBlur={handleBlur}
              cols={10}
              rows={3}
            />
            <Error field="remark" />
          </div>
        </div>

        {/* {console.log(isValid, "checkisValid")} */}
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
            {/* {console.log(
              !isValid || btnDisable || isApproved,
              "check270",
              errors,
              values
            )} */}
            <div className="col-auto">
              <button
                className="btn btn-blue"
                disabled={!isValid || btnDisable || isApproved}
                onClick={() => {
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
)(Changewalletwithdrawalrequeststatus);
