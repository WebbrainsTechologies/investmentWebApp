import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import enhancer from "./enhancer/EditProfileEnhancer";

import NavigationActions from "redux/navigation/actions";
import {
  get_superadmin_profile,
  update_admin_profile
} from "services/adminUserServices";
import Loader from "components/Loader";
import { Edit2 } from "react-feather";
import user_icon from "../../../assets/images/user-icon.svg";
import authActions from "redux/auth/actions";
import CopyButton from "./CopyButton";
import { Country } from "country-state-city";
import Select from "react-select";

const { success, error } = NavigationActions;
const { setUser } = authActions;

const EditProfile = (props, { titleStyle }) => {
  // console.log(props, "props")
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    token,
    setValues,
    user,
    handleSubmit,
    isValid,
    setFieldTouched
  } = props;
  const [loading, setLoading] = useState(false);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);

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

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    await get_superadmin_profile(token).then(res => {
      // console.log("super admin response", res);
      if (res.success) {
        setValues({
          ...res.data,
          name: res?.data?.name,
          email: res?.data?.email,
          phone_number: res?.data?.phone_number,
          address: res.data?.address,
          profile_img: res.data.profile_img,
          gender: res.data.gender ? res.data.gender : "",
          country: res.data.country ? res.data.country : "",
          country_code: res.data.country_code ? res.data.country_code : "",
          current_file: null
        });
        let userData = res.data;
        props.setUser(userData);
      } else {
        error(res.message);
      }
    });
  };

  const submitHandler = async event => {
    event.preventDefault();
    handleSubmit();
    if (isValid) {
      var formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("country_code", values.country_code);
      formData.append("phone_number", values.phone_number);
      formData.append("address", values.address);
      formData.append("gender", values.gender);
      formData.append("country", values.country);
      formData.append(
        "profile_img",
        values.current_file !== null ? values.current_file : values.profile_img
      );
      setLoading(true);
      await update_admin_profile(token, formData).then(res => {
        if (res.success) {
          success(res.message);
          getProfile();
          setLoading(false);
        } else {
          error(res.message);
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
    <div className="work-card">
      <div className="work-body white-card pt-4 pb-0">
        <div className="settingtitle">
          <i className="fas fa-user"></i>{" "}
          <span className="ml-1">Profile Information</span>
        </div>
        {user?.is_superadmin ? (
          <></>
        ) : (
          <>
            <div className="m-2">
              <CopyButton
                referralCode={user?.referral_code}
                text={"Referral Code :"}
              />
            </div>
            {/* <div className="m-2">
              <CopyButton
                referralCode={`${process.env.REACT_APP_BACKEND_URI}/register?id=${user?.referral_code}`}
                text={"Referral Link :"}
              />
            </div> */}
          </>
        )}
        <form onSubmit={submitHandler} className="my-0">
          <div className="row">
            <div className="col-sm-4 custom-profile-column">
              <div
                className="col detail-image-grid"
                style={{ position: "relative" }}
              >
                <input
                  type="file"
                  hidden
                  id="profile_img"
                  accept=".jpg,.png,.jpeg,.svg"
                  // value={values.profile_img}
                  onBlur={handleBlur}
                  onChange={e => {
                    if (e.target.files[0]) {
                      if (
                        ["png", "jpg", "jpeg", "svg+xml"].includes(
                          e.target.files[0]?.type.split("/")[1]
                        )
                      ) {
                        setValues({
                          ...values,
                          current_file: e.target.files[0],
                          profile_img: URL.createObjectURL(e.target.files[0])
                        });
                      } else {
                        error(
                          "This file format is not accepted. You can upload only SVG, JPEG, JPG, and PNG Files"
                        );
                      }
                    }
                  }}
                />
                <label
                  className="detail-img-wrap mb-11 cursor"
                  htmlFor="profile_img"
                  style={{ borderRadius: "50%" }}
                >
                  {values.profile_img === "" && (
                    <img
                      src={user_icon}
                      className="detail-img userprofileimage"
                      alt="default"
                      style={{ borderRadius: "50%" }}
                    />
                  )}
                  {values.profile_img !== "" && (
                    <img
                      src={
                        values.current_file === null
                          ? `${process.env.REACT_APP_UPLOAD_DIR}${values.profile_img}`
                          : values.profile_img
                      }
                      className="profile-img patient_img"
                      alt="no"
                    />
                  )}

                  <label
                    className="blue-link cursor editpen"
                    htmlFor="profile_img"
                    // onClick={this.uploadImg}
                  >
                    <Edit2 />
                  </label>
                </label>
                {/* <p className="file-message">
                  Please upload file upto 2MB. <br /> Only JPG, JPEG, PNG and
                  SVG files are allowed.
                </p> */}
              </div>
            </div>
            <div className="col-sm-8">
              <div className="row justify-content-center py-3">
                <div className="col-sm-10">
                  <div className="form-group">
                    <label>
                      {user.is_superadmin ? "Business name" : "Name"}
                    </label>{" "}
                    <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="name"
                      onChange={handleChange}
                      value={values.name}
                      onBlur={handleBlur}
                      placeholder={"Name"}
                    />
                    <Error field="name" />
                  </div>
                  <div className="form-group">
                    <label>Email</label> <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="email"
                      onChange={handleChange}
                      value={values.email}
                      onBlur={handleBlur}
                      placeholder="Admin Email"
                      disabled
                    />
                    <Error field="email" />
                  </div>
                  <div className="form-group">
                    <label>Country code</label> <span className="red">*</span>
                    <Select
                      id="country_code"
                      name="country_code"
                      options={countryCodeOptions}
                      classNamePrefix="select"
                      placeholder="select country code"
                      value={countryCodeOptions.find(val => {
                        return val.value === values.country_code;
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
                    <label>Phone</label> <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="phone_number"
                      onChange={handleChange}
                      value={values.phone_number}
                      onBlur={handleBlur}
                      placeholder="Phone number"
                    />
                    <Error field="phone_number" />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      className="detail-input-select custom-select"
                      value={values?.gender}
                      name="gender"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option hidden disabled value="">
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <Error field="gender" />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="country"
                      onChange={handleChange}
                      value={values.country}
                      onBlur={handleBlur}
                      placeholder="Country Name"
                    />
                    <Error field="country" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      type="text"
                      className="form-control react-form-input"
                      id="address"
                      onChange={handleChange}
                      value={values.address}
                      onBlur={handleBlur}
                      placeholder="Address"
                    />
                    <Error field="address" />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-blue">
                      Save
                    </button>
                  </div>
                </div>
              </div>
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
)(EditProfile);
