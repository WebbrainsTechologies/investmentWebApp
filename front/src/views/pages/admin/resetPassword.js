import React, { useState } from "react";

import { resetPassword } from "services/adminUserServices";
import enhancer from "./enhancer/ResetPasswordEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { useParams } from "react-router-dom";
// import logo from "../../../assets/images/minbly_logo.svg";
import { loginBack, ForgotIcon } from "helper/constant";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import iconDemo from "../../../assets/images/logo-white.png";

const { success, error } = NavigationActions;

const ResetPassword = props => {
  // let { token } = useParams();
  const { success, error } = props;
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    isValid
  } = props;

  const token_id = useParams();

  // console.log(token_id)

  const handleResetPassword = async e => {
    const { values, isValid, handleSubmit } = props;
    e.preventDefault();
    handleSubmit();

    if (isValid) {
      var resetdata = {
        reset_token: token_id.id,
        new_password: values.newpassword,
        confirmpassword: values.confirmpassword
      };
      setLoading(true);
      await resetPassword(resetdata).then(data => {
        if (data.success) {
          setPasswordResetSuccess(true);
          success(data.message);
        } else {
          error(data.message);
        }
        setLoading(false);
      });
    }
  };

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

  const loginContainer = {
    backgroundImage: `url(${loginBack})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    position: "fixed",
    overflow: "auto",
    top: 0,
    bottom: 0
  };

  return (
    // <h1>Reset Password</h1>
    <div className="container-fluid login-box-center" style={loginContainer}>
      <div className="login-form-main">
        <div className="login-icon">
          <img src={iconDemo} alt="icon" height="100px" />
        </div>
        <div className="form-container">
          {/* <div className="login-icon">
          <img src={ForgotIcon} alt="icon" height="100px" />
        </div> */}
          {passwordResetSuccess ? (
            <>
              <div className="login-title">
                Your password has been successfully reset.
              </div>

              <div className=" pa-24 text-center">
                <button
                  type="submit"
                  className="btn btn-blue"
                  onClick={() => props.history.push("/login")}
                >
                  Back to Login
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="login-title">Set New Password</div>
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>
                    Password <span className="error-msg">*</span>
                  </label>
                  {/* <input
                                type="password"
                                className="form-control react-form-input"
                                id="newpassword"
                                aria-describedby="emailHelp"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newpassword}
                                placeholder="Password"
                            /> */}
                  <div className="input-group mb-3">
                    <input
                      type={togglePassword ? "text" : "password"}
                      className="form-control react-form-input"
                      id="newpassword"
                      onChange={handleChange}
                      value={values.newpassword}
                      onBlur={handleBlur}
                      placeholder="Password"
                    />
                    <div className="input-group-append">
                      {togglePassword ? (
                        <VisibilityOff
                          onClick={() => setTogglePassword(false)}
                        />
                      ) : (
                        <Visibility
                          onClick={() => {
                            setTogglePassword(true);
                            // console.log("clicked")
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <Error field="newpassword" />
                </div>
                <div className="form-group">
                  <label>
                    Confirm Password <span className="error-msg">*</span>
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type={toggleConfirmPassword ? "text" : "password"}
                      className="form-control react-form-input"
                      id="confirmpassword"
                      onChange={handleChange}
                      value={values.confirmpassword}
                      onBlur={handleBlur}
                      placeholder="Confirm Password"
                    />
                    <div className="input-group-append">
                      {toggleConfirmPassword ? (
                        <VisibilityOff
                          onClick={() => setToggleConfirmPassword(false)}
                        />
                      ) : (
                        <Visibility
                          onClick={() => {
                            setToggleConfirmPassword(true);
                            // console.log("clicked")
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {/* <input
                                type="password"
                                className="form-control react-form-input"
                                id="confirmpassword"
                                aria-describedby="emailHelp"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.confirmpassword}
                                placeholder="Confirm Password"
                            /> */}
                  <Error field="confirmpassword" />
                </div>
                <button
                  type="submit"
                  className="btn btn-blue"
                  disabled={isValid ? false : true}
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  enhancer,
  connect(null, { success, error })
)(ResetPassword);
