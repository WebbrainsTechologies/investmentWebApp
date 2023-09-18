import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import enhancer from "./enhancer/ChangePasswordEnhancer";
import NavigationActions from "redux/navigation/actions";
import { change_password } from "services/adminUserServices";
import AuthActions from "redux/auth/actions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loader from "components/Loader";

const { success, error } = NavigationActions;

const { setUser } = AuthActions;

const ChangePassword = props => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log(props, "props")
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    user,
    token,
    isValid
  } = props;

  // console.log("token", token)

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

  const changePasswordHandler = async event => {
    event.preventDefault();
    setLoading(true);
    await change_password(token, user._id, values).then(res => {
      // console.log(res, "res")
      if (res.success) {
        success(res.message);
        // setValues({
        //     name: res?.data?.name,
        //     email: res?.data?.email,
        //     phone: res?.data?.phone_number,
        // })
      } else {
        error(res.message);
      }
      setLoading(false);
    });
  };

  return (
    <div className="work-card">
      {/* <div className="Work-header" style={titleStyle}> */}
      <h4 className="page-title">Change Password</h4>
      {/* </div> */}
      <div className="work-body white-card py-4">
        <form onSubmit={changePasswordHandler}>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-7">
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-group mb-3">
                  <input
                    type={togglePassword ? "text" : "password"}
                    className="form-control react-form-input"
                    id="current_password"
                    onChange={handleChange}
                    value={values.current_password}
                    onBlur={handleBlur}
                    placeholder="Current Password"
                  />
                  <div className="input-group-append">
                    {togglePassword ? (
                      <VisibilityOff onClick={() => setTogglePassword(false)} />
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
                <Error field="current_password" />
              </div>
            </div>
            <div className="col-12 col-sm-7">
              <div className="form-group">
                <label>New Password</label>
                {/* <input
                                    type="text"
                                    className="form-control react-form-input"
                                    id="new_password"
                                    onChange={handleChange}
                                    value={values.new_password}
                                    onBlur={handleBlur}
                                    placeholder="New Password"
                                /> */}
                <div className="input-group mb-3">
                  <input
                    type={toggleNewPassword ? "text" : "password"}
                    className="form-control react-form-input"
                    id="new_password"
                    onChange={handleChange}
                    value={values.new_password}
                    onBlur={handleBlur}
                    placeholder="New Password"
                  />
                  <div className="input-group-append">
                    {toggleNewPassword ? (
                      <VisibilityOff
                        onClick={() => setToggleNewPassword(false)}
                      />
                    ) : (
                      <Visibility
                        onClick={() => {
                          setToggleNewPassword(true);
                          // console.log("clicked")
                        }}
                      />
                    )}
                  </div>
                </div>
                <Error field="new_password" />
              </div>
            </div>
            <div className="col-12 col-sm-7">
              <div className="form-group">
                <label>Confirm Passowrd</label>
                {/* <input
                                    type="text"
                                    className="form-control react-form-input"
                                    id="confirm_new_password"
                                    onChange={handleChange}
                                    value={values.confirm_new_password}
                                    onBlur={handleBlur}
                                    placeholder="Confirm Password"
                                /> */}
                <div className="input-group mb-3">
                  <input
                    type={toggleConfirmPassword ? "text" : "password"}
                    className="form-control react-form-input"
                    id="confirm_new_password"
                    onChange={handleChange}
                    value={values.confirm_new_password}
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
                <Error field="confirm_new_password" />
              </div>
            </div>

            <div className="col-12 col-sm-7">
              <button
                type="submit"
                className="btn btn-blue"
                // onClick={() => {
                //     changePasswordHandler();
                // }}
                disabled={isValid ? false : true}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      {loading && <Loader />}
    </div>
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
  // withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, setUser })
)(ChangePassword);
