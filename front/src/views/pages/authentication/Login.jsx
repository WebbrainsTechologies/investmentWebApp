import React, { useEffect, useState } from "react";
import { loginBack } from "helper/constant";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import AuthActions from "redux/auth/actions";
import enhancer from "./enhancer/LoginFormEnhancer";
import { checkApi, loginApi } from "services/authServices";
import NavigationActions from "redux/navigation/actions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loader from "components/Loader";
import iconDemo from "../../../assets/images/logo-white.png";
import { Modal } from "reactstrap";
import AddOtpModal from "./AddOtpModal";
import { reSendOtp } from "services/userProfileServices";

const { login, setUser } = AuthActions;

const {
  success,
  error,
  toggleOneTimeModal,
  fetching,
  toggleSubscriptionLoader
} = NavigationActions;

const Login = props => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [otpButton, setOtpButton] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);

  const handleLogin = async e => {
    e.preventDefault();
    let { values, handleSubmit, isValid, user } = props;

    // console.log("user", user);

    // if (values.email !== "" && values.password !== "") {
    //   // console.log("Here is your form value", values);

    //   const data = {
    //     token: "DEMOJWTTOKEN"
    //   };
    //   // using this method you can store token in redux
    //   props.login(data);
    //   props.history.push("/dashboard");
    // }

    if (isValid) {
      fetching();
      // console.log("values", values);
      setLoading(true);
      await loginApi({
        email: values.email?.toLowerCase(),
        password: values.password
      }).then(data => {
        // console.log(data.data, "login data");
        if (data.success) {
          success(data.message);
          // props.login(data.data);
          let userData = data.data;
          setUserEmail(userData?.email);
          setIsAdmin(userData?.is_superadmin);
          setIsOpen(true);
          // console.log(userData, "userData");
          // if (userData?.is_superadmin) {
          //   props.history.push("/admindashboard");
          // } else {
          //   props.history.push("/dashboard");
          // }
          // props.setUser(userData);
          setLoading(false);
        } else {
          if (data.message === "Error: First verify your email address") {
            setUserEmail(values?.email);
            setOtpButton(true);
          }
          error(data.message);
          setLoading(false);
        }
      });
    }
    handleSubmit();
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    isValid,
    token
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

  const handleResendOtp = async e => {
    e.preventDefault();
    setLoading(true);
    await reSendOtp({ email: email, account_verified: otpButton }).then(res => {
      if (res.success) {
        success(res.message);
        setIsOpen(true);
        // setOtpButton(false);
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };

  const checkLogin = async () => {
    fetching();
    await checkApi(token).then(data => {
      if (data.success) {
        // check(data.data);
        // toggleSubscriptionLoader(false);
        success();
        props.history.push("/dashboard");
      } else {
        error();
      }
    });
  };

  useEffect(() => {
    token !== null && checkLogin();
    // eslint-disable-next-line
  }, []);
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
          <a href="https://securefintec.com/">
            <img src={iconDemo} alt="icon" height="100px" />
          </a>
        </div>
        <div className="form-container">
          <div className="login-title mx-auto">Sign in</div>
          <p className="welcome-text">
            "Welcome to crypto investment platform"
          </p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              {/* <label>Email</label> */}
              <input
                type="email"
                className="form-control react-form-input"
                id="email"
                onChange={handleChange}
                value={values.email}
                onBlur={handleBlur}
                placeholder="Email"
              />
              <Error field="email" />
            </div>

            <div className="form-group">
              {/* <label>Password</label> */}
              {/* <input
                type="password"
                className="form-control react-form-input"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
              /> */}
              <div className="input-group">
                <input
                  type={togglePassword ? "text" : "password"}
                  className="form-control react-form-input"
                  id="password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                  placeholder="Password"
                />
                <div className="input-group-append">
                  {togglePassword ? (
                    <VisibilityOff onClick={() => setTogglePassword(false)} />
                  ) : (
                    <Visibility
                      onClick={() => {
                        setTogglePassword(true);
                        // console.log("clicked");
                      }}
                    />
                  )}
                </div>
              </div>
              <Error field="password" />
            </div>
            <div className="row justify-content-end">
              {/* <div className="col">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Remember me
                  </label>
                </div>
              </div> */}
              <div
                className="col text-right link-label forgot-text"
                onClick={() => props.history.push("/forgotPassword")}
              >
                Forgot Password ?
              </div>
            </div>
            {/* {otpButton ? (
              <div className="row">
                <div clasName="col">
                  <button
                    type="submit"
                    className="btn"
                    onClick={(e) => {
                      handleResendOtp(e);
                    }}
                  >
                    Send otp
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )} */}
            {/* {console.log(isValid, "isValid", values)} */}
            <div className="row login-btn-row align-items-center">
              <div className="col-sm-auto mb-3 mb-sm-0">
                {otpButton ? (
                  // <button
                  //   type="submit"
                  //   className="btn btn-blue"
                  //   onClick={(e) => {
                  //     handleResendOtp(e);
                  //   }}
                  // >
                  //   Send otp
                  // </button>
                  <p style={{ color: "red" }}>
                    Your account is not verified.{" "}
                    <span
                      className="link-label"
                      onClick={e => {
                        handleResendOtp(e);
                      }}
                    >
                      Click here
                    </span>{" "}
                    to verifie your account.
                  </p>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-blue"
                    disabled={isValid ? false : true}
                  >
                    Login
                  </button>
                )}
              </div>
              <div className="col-sm text-sm-right register-text">
                don’t have an account?{" "}
                <button
                  className="btn p-0 link-label"
                  onClick={() => props.history.push("/register")}
                >
                  register here
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal isOpen={isOpen} backdrop={true} centered>
        <AddOtpModal
          onClose={() => {
            setIsOpen(false);
            if (otpButton) {
              setOtpButton(false);
            }
          }}
          email={email}
          path={otpButton ? "Account" : "Sign In"}
          isAdmin={isAdmin}
        />
      </Modal>
      {loading && <Loader />}
    </div>
  );
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    token: state.auth.accessToken
    // user: state.auth.user,
    // isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, {
    // check,
    login,
    success,
    error,
    toggleOneTimeModal,
    toggleSubscriptionLoader,
    fetching,
    setUser
  })
)(Login);
