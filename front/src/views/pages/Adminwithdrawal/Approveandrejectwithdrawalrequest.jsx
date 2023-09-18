import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/ApproveandrejectwithdrawalrequestEnhancer";
import detail_img from "../../../assets/images/alert-icon.svg";
import { adminChangeWithdrawalRequest } from "services/userSubscriptionServices";

const { success, error, fetching } = NavigationActions;

const Approveandrejectwithdrawalrequest = props => {
  const {
    apiData,
    token,
    selectedId,
    onClose,
    touched,
    errors,
    submitCount,
    setValues,
    values,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
    isApproved
  } = props;

  const [btnDisable, setBtnDisable] = useState(false);

  // console.log(isApproved, "check32");
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
    apiData &&
      setValues({
        ...apiData,
        withdrawal_status:
          apiData?.withdrawal_status === "Pending"
            ? ""
            : apiData?.withdrawal_status
      });
  }, [apiData]);

  const updateStatus = async e => {
    e.preventDefault();
    handleSubmit();
    setBtnDisable(true);
    fetching();
    if (isValid) {
      await adminChangeWithdrawalRequest(token, apiData?._id, {
        withdrawal_status: values.withdrawal_status,
        userId: apiData?.userId?._id,
        notificationId: apiData?.notificationId,
        name: apiData?.name,
        withdrawal_remark: values.withdrawal_remark
      }).then(data => {
        if (data.success) {
          success(data.message);
          onClose();
          setBtnDisable(false);
        } else {
          error(data.message);
          onClose();
          setBtnDisable(false);
        }
      });
    }
  };
  // console.log(apiData, "check58");
  return (
    <>
      <div className="row px-2 py-4 mx-0">
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Package Name</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="name"
              value={apiData?.userId?.name}
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
              value={`${apiData.amount}   ${apiData.name}`}
              placeholder={"amount"}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="col-12 mb-2">
          <div className="form-group">
            <label>Principal withdrawal amount</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={`${(apiData.amount * apiData.principal_withdrawal) /
                100} ${apiData.currency}`}
              placeholder={"amount"}
              disabled
              readOnly
            />
          </div>
        </div>
        <div className="col-12 mb-2">
          <label htmlFor="status">status</label>
          {values?.withdrawal_status === "Closed" ? (
            <input
              type="text"
              className="form-control react-form-input"
              id="amount"
              value={values.withdrawal_status}
              placeholder={"amount"}
              disabled
              readOnly
            />
          ) : (
            <>
              <select
                name="status"
                id="status"
                disabled={isApproved}
                value={values.withdrawal_status}
                onChange={e => {
                  setValues({ ...values, withdrawal_status: e.target.value });
                }}
                className="custom-select"
              >
                <option value={""} hidden>
                  Pending
                </option>
                <option value={"Accepted"}>Accept</option>
                <option value={"Rejected"}>Reject</option>
              </select>
              <Error field="status" />
            </>
          )}
        </div>

        {values.withdrawal_status === "Rejected" ? (
          <div className="col-12">
            <div className="form-group">
              <label>Remark</label>
              <textarea
                name="withdrawal_remark"
                id="withdrawal_remark"
                disabled={isApproved}
                className="form-control"
                placeholder="Enter Remark"
                defaultValue={values.withdrawal_remark}
                onChange={handleChange}
                onBlur={handleBlur}
                cols={10}
                rows={3}
              />
              <Error field="withdrawal_remark" />
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
                disabled={btnDisable || !isValid || isApproved}
                onClick={e => {
                  updateStatus(e);
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
  connect(mapStateToProps, { success, error, fetching })
)(Approveandrejectwithdrawalrequest);
