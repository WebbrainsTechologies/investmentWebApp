import React, { useState } from "react";
import { loginBack, ForgotIcon } from "helper/constant";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/ForgotPasswordEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { forgotPassword } from "services/adminUserServices";
import Loader from "components/Loader";
import iconDemo from "../../../assets/images/logo-white.png";

const { success, error, fetching } = NavigationActions;

const ForgotPassword = props => {
  // const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    success,
    error,
    fetching,
    isValid,
    handleSubmit,
    history
  } = props;

  const loginContainer = {
    backgroundImage: `url(${loginBack})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    position: "fixed",
    overflow: "auto",
    top: 0,
    bottom: 0
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      fetching();
      setLoading(true);
      await forgotPassword({
        email: values.email?.toLowerCase()
      }).then(data => {
        if (data.success) {
          success(data.message);
          setLoading(false);
        } else {
          error(data.message);
          setLoading(false);
        }
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

  return (
    <div className="container-fluid login-box-center" style={loginContainer}>
      <div className="login-form-main">
        <div className="login-icon">
          <img src={iconDemo} alt="icon" height="100px" />
        </div>
        <div className="form-container">
          <div className="login-title">Forgot Password ?</div>
          <div className="welcome-text">
            “don’t worry just enter your email we will send you the reset
            password link”
          </div>
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <input
                type="email"
                className="form-control react-form-input"
                id="email"
                aria-describedby="emailHelp"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter email"
              />
              <Error field="email" />
            </div>
            <div className="row justify-content-between login-btn-row">
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-blue"
                  disabled={isValid ? false : true}
                >
                  Get Link
                </button>
              </div>
              <div
                className="col text-right link-label forgot-text"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login
              </div>
            </div>
          </form>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    // isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching })
)(ForgotPassword);
