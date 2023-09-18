import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/UserpersonalinfoEnhancer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
// import ReactDatePicker from "react-datepicker";
import Datepicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { addKyc, editKyc } from "services/kycServices";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const { success, error, fetching } = NavigationActions;

const UserPersonalInfo = props => {
  const {
    activeStep,
    token,
    user,
    kycdetails,
    setKycdetails,
    setActiveStep,
    handleChange,
    values,
    handleBlur,
    submitCount,
    touched,
    errors,
    setValues,
    isValid,
    handleSubmit
  } = props;

  // console.log(kycdetails, "check33");
  const [btnDisable, setBtnDisable] = useState(false);

  const today = new Date();
  let eighteenYearsAgo = new Date(today);
  eighteenYearsAgo = new Date(
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18)
  );

  useEffect(() => {
    kycdetails &&
      setValues({
        ...values,
        firstName: kycdetails.firstName,
        lastName: kycdetails.lastName,
        middleName: kycdetails.middleName,
        dateOfBirth: moment(kycdetails.dateOfBirth).toDate(),
        gender: kycdetails.gender
        // aadhar_number: kycdetails.aadhar_number,
        // pan_number: kycdetails.pan_number,
      });
  }, [kycdetails]);
  const handleEditKyc = async () => {
    handleSubmit();
    if (isValid) {
      kycdetails?._id
        ? await editKyc(token, kycdetails?._id, values).then(res => {
            if (res.success) {
              setKycdetails(res.data?._doc);
              setActiveStep(activeStep + 1);
              setBtnDisable(false);
            } else {
              error(res.message);
            }
          })
        : await addKyc(token, user?._id, values).then(res => {
            if (res.success) {
              setKycdetails(res.data);
              setActiveStep(activeStep + 1);
              setBtnDisable(false);
            } else {
              error(res.message);
            }
          });
    } else {
      setBtnDisable(false);
    }
  };
  const genderoptions = ["Male", "Female", "Other"];
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
    <div className="card p-4">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label>First Name</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="firstName"
                  onChange={handleChange}
                  value={values.firstName}
                  onBlur={handleBlur}
                  placeholder={"First Name"}
                />
                <Error field="firstName" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Last Name</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="lastName"
                  onChange={handleChange}
                  value={values.lastName}
                  onBlur={handleBlur}
                  placeholder={"Last Name"}
                />
                <Error field="lastName" />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Middle Name</label>
                <small></small>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="middleName"
                  onChange={handleChange}
                  value={values.middleName}
                  onBlur={handleBlur}
                  placeholder={"Middle Name"}
                />
                <Error field="middleName" />
              </div>
            </div>
          </div>
        </div>
        {/* {console.log(eighteenYearsAgo, "Check148")} */}
        <div className="col-12 mb-4">
          <div className="row">
            <div className="col-md-6">
              <label>Birth Date</label> <span className="red">*</span>
              <Datepicker
                onChange={date => {
                  if (date) {
                    setValues({ ...values, dateOfBirth: date });
                  } else {
                    setValues({ ...values, dateOfBirth: "" });
                  }
                }}
                id="dateOfBirth"
                value={values.dateOfBirth ? values.dateOfBirth : ""}
                onBlur={handleBlur}
                maxDate={eighteenYearsAgo}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select Birth Date"
                className="form-control"
                // filterDate={isDateDisabled}
                // className="form-control react-form-input without-login-fields calender-custom-icon"
                // calendarClassName="custom-calender-class"
                // dropdownMode="select"
              />
              <Error field="dateOfBirth" />
            </div>
            <div className="col-md-6">
              <label>Gender</label> <span className="red">*</span>
              <select
                className="form-control custom-select"
                id="gender"
                value={genderoptions.find(val => val === values.gender)}
                onChange={e => {
                  if (e.target.value) {
                    setValues({ ...values, gender: e.target.value });
                  }
                }}
                onBlur={handleBlur}
                placeholder="Please select your gender"
              >
                <option value="" hidden selected>
                  Please select gender
                </option>
                {genderoptions.map((val, index) => {
                  return (
                    <option value={val} key={index}>
                      {val}
                    </option>
                  );
                })}
              </select>
              <Error field="gender" />
            </div>
          </div>
        </div>
        {/* <div className="col-12">
          <div className="row">
            <div className="col-12 mb-3">
              <h5 className="text-bold">Document details</h5>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Aadhar Number</label>
                <span className="red">*</span>
                <small></small>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="aadhar_number"
                  onChange={handleChange}
                  value={values.aadhar_number}
                  onBlur={handleBlur}
                  placeholder={"Addhar number"}
                />
                <Error field="aadhar_number" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Pan Number</label>
                <span className="red">*</span>
                <small></small>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="pan_number"
                  onChange={handleChange}
                  value={values.pan_number}
                  onBlur={handleBlur}
                  placeholder={"Pan Number"}
                />
                <Error field="pan_number" />
              </div>
            </div>
          </div>
        </div> */}
        <div className="col-12 text-right">
          <button
            className="btn btn-blue"
            disabled={btnDisable}
            onClick={() => {
              setBtnDisable(true);
              handleEditKyc();
            }}
          >
            Next
          </button>
        </div>
      </div>
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
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching })
)(UserPersonalInfo);
