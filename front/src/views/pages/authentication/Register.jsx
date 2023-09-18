import React, { useEffect, useState } from "react";
import { loginBack } from "helper/constant";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import enhancer from "./enhancer/RegisterFormEnhancer";
import { userRegister } from "services/userProfileServices";
import { connect } from "react-redux";
import navigationAction from "redux/navigation/actions";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import iconDemo from "../../../assets/images/logo-white.png";
import { Modal } from "reactstrap";
import AddOtpModal from "./AddOtpModal";
import Loader from "components/Loader";
import terms_condition_pdf from "../../../assets/termsandconditions/GTC-SF.pdf";
import { Country } from "country-state-city";
import Select from "react-select";

const { success, error } = navigationAction;
const Register = props => {
  let {
    isValid,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    values,
    setValues,
    setFieldTouched
  } = props;
  const [togglePassword, setTogglePassword] = useState(false);
  const [confirmTogglePassword, setConfirmTogglePassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  console.log(id, "check39");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    id && setValues({ ...values, referral_code: id });
  }, [id]);

  useEffect(() => {
    let countryData = Country.getAllCountries();
    // console.log(countryData, "cehck61");
    setCountryCodeOptions(
      countryData.map(val => {
        if (val.phonecode?.includes("+")) {
          return {
            value: `${val.phonecode}`,
            label: `${val.phonecode} ${val.name}`
          };
        } else {
          return {
            value: `+${val.phonecode}`,
            label: `+${val.phonecode} ${val.name}`
          };
        }
      })
    );
  }, []);

  const handleRegister = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      // console.log("Here is your form value", values);
      setLoading(true);
      let data = {
        ...values,
        email: values.email?.toLowerCase(),
        is_superadmin: false,
        user_status: true,
        referral_code: values.referral_code
          ? values.referral_code
          : process.env.REACT_APP_ADMIN_REFFERAL
      };
      // console.log(data, "chcekdata48");
      await userRegister(data).then(res => {
        if (res.success) {
          success(res.message);
          setLoading(false);
          // props.history.push("/login");
          setIsOpen(true);
        } else {
          error(res.message);
          setLoading(false);
        }
      });
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
        <div>
          <div className="form-container">
            <div className="login-title">Create Account</div>
            <form onSubmit={e => handleRegister(e)}>
              <div className="form-group">
                {/* <label>Name</label> */}
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Name"
                />
                <Error field="name" />
              </div>

              {/* <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control react-form-input"
                id="lastname"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Last Name"
              />
              <Error field="lastname" />
            </div> */}
              <div className="form-group">
                {/* <label>Email</label> */}
                <input
                  type="email"
                  className="form-control react-form-input"
                  id="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Email"
                />
                <Error field="email" />
              </div>
              <div className="form-group">
                {/* <label>Country code</label> <span className="red">*</span> */}
                <Select
                  id="country_code"
                  name="country_code"
                  options={countryCodeOptions}
                  classNamePrefix="select"
                  placeholder="select country code"
                  value={countryCodeOptions.find(val => {
                    return `+${val.value}` === values.country_code;
                  })}
                  onChange={e => {
                    if (e) {
                      setValues({
                        ...values,
                        country_code: e?.value
                      });
                    }
                  }}
                  onBlur={() => {
                    setFieldTouched("country_code", true);
                  }}
                />
                <Error field="country_code" />
              </div>
              <div className="form-group">
                {/* <label>Phone Number:</label> */}
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="phone_number"
                  onChange={e => {
                    setValues({
                      ...values,
                      phone_number: e.target.value?.trim()
                    });
                  }}
                  onBlur={handleBlur}
                  placeholder="Phone Number"
                />
                <Error field="phone_number" />
              </div>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type={togglePassword ? "text" : "password"}
                    className="form-control react-form-input"
                    id="password"
                    onChange={handleChange}
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
              </div>
              <Error field="password" />
              <div className="form-group">
                <div className="input-group">
                  <input
                    type={confirmTogglePassword ? "text" : "password"}
                    className="form-control react-form-input"
                    id="confirm_password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Confirm Password"
                  />
                  <div className="input-group-append">
                    {confirmTogglePassword ? (
                      <VisibilityOff
                        onClick={() => setConfirmTogglePassword(false)}
                      />
                    ) : (
                      <Visibility
                        onClick={() => {
                          setConfirmTogglePassword(true);
                          // console.log("clicked");
                        }}
                      />
                    )}
                  </div>
                </div>
                <Error field="confirm_password" />
              </div>
              <div className="form-group">
                {/* <label>Phone Number:</label> */}
                <input
                  type="text"
                  className="form-control react-form-input dotedborder"
                  value={values.referral_code}
                  id="referral_code"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Referral code"
                />
                <Error field="referral_code" />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                  checked={values.terms_condition}
                  onChange={e => {
                    setValues({ ...values, terms_condition: e.target.checked });
                  }}
                />
                <label
                  className="form-check-label register-privacy-text"
                  htmlFor="exampleCheck1"
                >
                  Agree to{" "}
                  <a
                    href={terms_condition_pdf}
                    className="link-label"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms & privacy policy
                  </a>
                </label>
              </div>
              <Error field="terms_condition" />
              <div className="row login-btn-row align-items-center">
                <div className="col-sm-auto mb-3 mb-sm-0">
                  <button
                    type="submit"
                    className="btn btn-blue"
                    disabled={isValid ? false : true}
                  >
                    Register
                  </button>
                </div>
                <div className="col-sm text-sm-right register-text">
                  already have an account ?{" "}
                  <button
                    className="btn p-0 link-label"
                    onClick={() => props.history.push("/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} backdrop={true} centered>
        <AddOtpModal
          onClose={() => {
            setIsOpen(false);
          }}
          email={values.email}
          path="Sign Up"
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
    success,
    error
  })
)(Register);

// export default compose(withRouter, enhancer)(Register);
