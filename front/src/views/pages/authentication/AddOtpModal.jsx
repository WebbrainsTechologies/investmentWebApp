import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import enhancer from "./enhancer/AddotpModalEnhancer";
import { compose } from "redux";
import OtpInput from "react-otp-input";
import { withRouter } from "react-router";
import navigationAction from "redux/navigation/actions";
import { checkOtp, reSendOtp } from "services/userProfileServices";
import authActions from "redux/auth/actions";
import { XCircle } from "react-feather";

const { success, error } = navigationAction;
const { login, setUser } = authActions;

const AddOtpModal = props => {
  const {
    onClose,
    error,
    email,
    path,
    errors,
    touched,
    submitCount,
    values,
    setFieldValue,
    isValid,
    history,
    success,
    handleBlur,
    isAdmin,
    selectedCurrency,
    withdrawalType,
    user
    // walletAmount
  } = props;

  // console.log(errors, "checkerror");
  const [resend, setResend] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [resendbtnDisabled, setResendBtnDisabled] = useState(false);

  const Error = props => {
    const field1 = props.field;
    // console.log(field1, "checkfield1");
    // console.log(
    //   (errors[field1] && touched[field1]) || submitCount > 0,
    //   "checkcondition",
    //   errors[field1] && touched[field1],
    //   submitCount > 0
    // );
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
  const handleResendOtp = async e => {
    e.preventDefault();
    await reSendOtp({ email: email }).then(res => {
      if (res.success) {
        success(res.message);
        setResendBtnDisabled(false);
      } else {
        error(res.message);
        setResendBtnDisabled(false);
        onClose();
      }
    });
  };
  // console.log(email, "checkemail");
  const handleConfirmOTP = async e => {
    setBtnDisabled(true);
    e.preventDefault();
    if (isValid) {
      let data = {
        email: email,
        otp: values.otpCheck,
        page: path
      };
      await checkOtp(data).then(res => {
        // console.log(res.data, "chcekdata69");
        if (res.success) {
          success(res.message);
          if (path === "Sign Up") {
            history.push("/login");
          } else if (path === "Account") {
            onClose();
            success("Your account verified successfully!");
          } else if (path === "Sign In") {
            // console.log(res.data, "checkdata74");
            props.login(res.data);
            props.setUser(res.data);
            isAdmin
              ? history.push("/admindashboard")
              : history.push("/dashboard");
          } else {
            if (withdrawalType === "manual") {
              props.history.push(`/manual-withdrawal/${selectedCurrency}`);
            } else {
              if (user?.is_bank_verified) {
                props.history.push(`/choosebankaccount/${selectedCurrency}`);
              } else {
                props.history.push(`/linkbankaccount?id=${selectedCurrency}`);
              }
            }
          }
        } else {
          error(res.message);
          setBtnDisabled(false);
        }
      });
    } else {
      setBtnDisabled(false);
    }
  };
  return (
    <div className="form-container text-center" style={{ boxShadow: "none" }}>
      {path === "Withdrawal" ? (
        <div className="cancle">
          <XCircle onClick={() => onClose()} />
        </div>
      ) : null}
      <div className="appt-modal-content">
        <div className="login-title">{path} Verification</div>
        <div className="appt-modal-body">
          <div className=" my-2">
            <span className="mb-4 d-block">
              Verification Code has been sent to {email}
            </span>
          </div>
          <div className="mb-2">
            <label>Enter Verification Code</label>
          </div>

          <div className="otp-main mb-3">
            <OtpInput
              value={values.otpCheck}
              numInputs={4}
              renderSeparator={<span> </span>}
              isInputNum={true}
              onChange={e => {
                setFieldValue("otpCheck", e);
              }}
              onBlur={handleBlur}
              renderInput={props => <input {...props} />}
              inputStyle={{
                width: "40px",
                border: "0.5px solid #2176c3",
                borderRadius: "2px"
              }}
              className="justify-content-center"
              name="otpCheck"
              id="otpCheck"
            />
          </div>

          <Error field="otpCheck" />
          {/* {console.log(values, "otpvalues")} */}

          {resend ? (
            <div className="mb-3">
              <span
                className="resend_otp"
                onClick={() => {
                  handleResendOtp();
                }}
              >
                Resend Verification Code
              </span>
            </div>
          ) : (
            <></>
          )}
          <div className="appt-modal-btn-wrap space-between mr-2">
            <button
              type="submit"
              className="btn btn-blue my-3"
              style={{ width: "100%" }}
              onClick={e => handleConfirmOTP(e)}
              disabled={btnDisabled}
            >
              Submit
            </button>
          </div>
          <button
            className="btn resendtext"
            onClick={e => {
              setResendBtnDisabled(true);
              handleResendOtp(e);
            }}
            disabled={resendbtnDisabled}
          >
            Resend Otp
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, login, setUser })
)(AddOtpModal);
