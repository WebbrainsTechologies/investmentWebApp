import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/userlistAddEditenhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import { Country } from "country-state-city";
import Select from "react-select";

import {
  userRegisterByAdmin,
  userUpdateByAdmin
} from "services/userProfileServices";

const { success, error } = NavigationActions;
const UserAddEdit = props => {
  const { isEdit, editData, onClose } = props;
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    token,
    isValid,
    setValues,
    setFieldValue,
    handleSubmit,
    toggleRefresh,
    isView,
    setFieldTouched
  } = props;
  const [loading, setLoading] = useState(false);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [durationList, setDurationList] = useState([]);
  useEffect(() => {
    (isEdit || isView) &&
      setValues({
        ...editData,
        is_delete: editData?.is_delete ? false : true
      });
  }, [editData]);
  console.log(editData, "check46");
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

  const ServiceHandler = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      let data = {
        name: values.name,
        email: values.email,
        country_code: values.country_code,
        phone_number: values.phone_number,
        is_superadmin: false,
        is_delete:
          values.is_delete === "true"
            ? false
            : values.is_delete === true
            ? false
            : true
      };
      setLoading(true);
      isEdit
        ? await userUpdateByAdmin(token, values._id, data).then(res => {
            if (res.success) {
              success(res.message);
              setLoading(false);
              toggleRefresh(true);
              onClose();
            } else {
              error(res.message);
              setLoading(false);
            }
          })
        : await userRegisterByAdmin(token, data).then(res => {
            if (res.success) {
              success(res.message);
              setLoading(false);
              toggleRefresh(true);
              onClose();
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
    <>
      <ModalHeader toggle={() => onClose()}>
        {isView ? "View" : isEdit ? "Edit" : "Add"} User
      </ModalHeader>
      <ModalBody>
        <form>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>
                  Name <span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="name"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                  placeholder="User Name"
                />
                <Error field="name" />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control react-form-input"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEdit}
                  placeholder="Email"
                />
                <Error field="email" />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Country code</label> <span className="red">*</span>
                <Select
                  id="country_code"
                  name="country_code"
                  options={countryCodeOptions}
                  classNamePrefix="select"
                  placeholder="select country code"
                  value={countryCodeOptions.find(val => {
                    // console.log(
                    //   values.country_code,
                    //   "check174",
                    //   val.value,
                    //   val.value === values.country_code,
                    //   typeof `+${val.value}`,
                    //   typeof values.country_code,
                    //   val.value === "+91"
                    //     ? "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"
                    //     : ""
                    // );
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
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="phone_number"
                  value={values.phone_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Phone Number"
                />
                <Error field="phone_number" />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>
                  <select
                    name="is_delete"
                    id="is_delete"
                    value={values.is_delete}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="custom-select"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </label>
                <Error field="is_delete" />
              </div>
            </div>
            {isView ? (
              <></>
            ) : (
              <div className="col-12">
                <div className="row justify-content-end">
                  <div className="col-auto pr-0">
                    <button
                      onClick={e => ServiceHandler(e)}
                      type="submit"
                      className="btn btn-blue"
                      disabled={isValid ? false : true}
                    >
                      {isEdit ? "Update" : "Add"}
                      {/* {console.log(isValid,values,"isValid")} */}
                    </button>
                  </div>
                  <div className="col-auto">
                    <button
                      onClick={() => {
                        onClose();
                      }}
                      className="btn form-button modalcancelbutton"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </ModalBody>
      {loading ? <Loader /> : ""}
    </>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default compose(
  // withRouter,
  enhancer,
  connect(mapStateToProps, { success, error })
)(UserAddEdit);
