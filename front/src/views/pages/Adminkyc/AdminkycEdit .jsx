import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/adminEditEnhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import {
  userRegisterByAdmin,
  userUpdateByAdmin
} from "services/userProfileServices";
import detail_img from "../../../assets/images/Frame 463426.svg";
import { useParams } from "react-router-dom";
import { editKyc, getKycByUserId } from "services/kycServices";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, Phone, User } from "react-feather";
import { kycUpdate } from "services/onemetaapis";

const { success, error } = NavigationActions;
const Adminkycedit = props => {
  const { id } = useParams();
  // console.log(id, "checkid");
  const inputFile = useRef(null);

  const status = ["Pending", "Approve", "Reject"];
  const section = [
    {
      label: "Section 1",
      value: 1
    },
    {
      label: "Section 2",
      value: 2
    },
    {
      label: "Section 3",
      value: 3
    },
    {
      label: "Section 4",
      value: 4
    }
  ];
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
    history
  } = props;
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isbuttonHide, setIsButtonHide] = useState(false);

  const getKycDetilsById = async () => {
    setLoading(true);
    await getKycByUserId(token, id).then(res => {
      if (res.success) {
        setValues({
          ...values,
          ...res.data,
          dateOfBirth: moment(res.data?.dateOfBirth).toDate()
        });
        if (res.data?.status !== "Pending") {
          setIsButtonHide(true);
        }
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    getKycDetilsById();
  }, []);
  const handleEditKyc = async () => {
    handleSubmit();
    if (isValid) {
      setLoading(true);
      await editKyc(token, values?._id, values).then(async res => {
        if (res.success) {
          // console.log(res, "checkres94");
          if (values.status === "Approve") {
            let formData = new FormData();
            formData.append("firstName", res?.data?.encreptedFirstName);
            formData.append("lastName", res?.data?.encreptedLastName);
            formData.append("email", values.userId?.email);
            formData.append("aadharNumber", res?.data?.encreptedaadhar_number);
            formData.append("panNumber", res?.data?.encreptedpan_number);
            await kycUpdate(
              //   {
              //   firstName: values.firstName,
              //   lastName: values.lastName,
              //   email: values.userId?.email,
              //   aadharNumber: values.aadhar_number,
              //   panNumber: values.pan_number,
              // }
              formData
            ).then(res => {
              if (res?.success) {
                success();
              } else {
                // console.log(error, "check114");
                // error(
                //   res?.error?.message
                //     ? res?.error?.message
                //     : res?.message
                //     ? res?.message
                //     : ""
                // );
              }
            });
          }
          setLoading(false);
          history.goBack();
          success(res.message);
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
  // console.log(values.dateOfBirth, "check149");
  return (
    <>
      <div className="row">
        <div className="col-lg-9 page-container">
          <div className="row">
            <div className="col-12">
              <div className="row justify-content-between">
                <div className="col">
                  <h4 className="page-title">User Kyc Details</h4>
                </div>
                <div className="col-auto">
                  <button
                    className="btn"
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    <ArrowLeft /> Back
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12">
              {" "}
              <div className="card mb-4 py-3 pl-3">
                <div className="row ">
                  <div className="col-xl-4 col-sm-6 mb-2">
                    <p>
                      <User /> Name : {values.userId?.name}
                    </p>
                  </div>
                  <div className="col-xl-4 col-sm-6 mb-2">
                    <p>
                      <Mail /> Email : {values.userId?.email}
                    </p>
                  </div>
                  <div className="col-xl-4 col-sm-6">
                    <p>
                      <Phone /> Phone No. : {values.userId?.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="row">
              <div
                className="col-12 mb-4"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Section 1
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="firstName"
                    value={values.firstName}
                    placeholder={"First Name"}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="lastName"
                    value={values.lastName}
                    placeholder={"Last Name"}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="middleName"
                    value={values.middleName}
                    placeholder={"Middle Name"}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <label>Birth Date</label>
                <ReactDatePicker
                  showYearDropdown
                  showMonthDropdown
                  selected={values.dateOfBirth}
                  id="dateOfBirth"
                  value={values.dateOfBirth ? values.dateOfBirth : ""}
                  maxDate={new Date()}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Birth Date"
                  className="form-control react-form-input without-login-fields calender-custom-icon"
                  calendarClassName="custom-calender-class"
                  disabled
                  readOnly
                />
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Gender</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="gender"
                    value={values.gender}
                    placeholder={"Gender"}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div
                className="col-12 my-4"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Section 2
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="address_line_one"
                    value={values?.address_line_one}
                    placeholder={"Address Line 1"}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="address_line_second"
                    value={values?.address_line_second}
                    placeholder={"Address Line 2"}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Address Line 3</label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="address_line_third"
                    value={values?.address_line_third}
                    placeholder={"Address Line 3"}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="city"
                        value={values?.city}
                        placeholder={"City Name"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="state"
                        value={values?.state}
                        placeholder={"State Name"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="country"
                        value={values?.country}
                        placeholder={"Country Name"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="pincode"
                        value={values?.pincode}
                        placeholder={"Enter Pincode"}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 my-4"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                Section 3
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label>Document Type</label>
                  <input
                    className="form-control"
                    type="text"
                    value={values.document_type}
                    disabled
                    readOnly
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-sm-6 col-lg-5">
                    <div className="form-group">
                      <label>Front Image</label>
                      <div className="file-group">
                        <a
                          href={`${process.env.REACT_APP_UPLOAD_DIR}${values.front_image}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${process.env.REACT_APP_UPLOAD_DIR}${values.front_image}`}
                            className="profile-img patient_img"
                            alt="no"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-5">
                    <div className="form-group">
                      <label>Back Image</label>
                      <div className="file-group">
                        <a
                          href={`${process.env.REACT_APP_UPLOAD_DIR}${values.back_image}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${process.env.REACT_APP_UPLOAD_DIR}${values.back_image}`}
                            className="profile-img patient_img"
                            alt="no"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  <div
                    className="col-12 my-4"
                    style={{ fontWeight: "bold", fontSize: "18px" }}
                  >
                    Section 4
                  </div>
                  <div className="col-sm-6 col-lg-5">
                    <div className="form-group">
                      <label>Selfi Image</label>
                      <div className="file-group">
                        <a
                          href={`${process.env.REACT_APP_UPLOAD_DIR}${values.selfi_image}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={`${process.env.REACT_APP_UPLOAD_DIR}${values.selfi_image}`}
                            className="profile-img patient_img"
                            alt="no"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <lable>Status</lable>
                  <select
                    id="status"
                    name="status"
                    className="custom-select"
                    disabled={isbuttonHide}
                    value={status.find(val => val === values.status)}
                    onChange={e => {
                      if (e.target.value) {
                        setValues({ ...values, status: e.target.value });
                        if (e.target.value === "Reject") {
                          setIsOpen(true);
                        } else {
                          setIsOpen(false);
                        }
                      }
                    }}
                  >
                    {status.map((val, index) => {
                      return (
                        <option value={val} key={index}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                  <Error field="status" />
                </div>
              </div>
              {isOpen ? (
                <div className="col-12">
                  <div className="form-group">
                    <lable>Reject Section</lable>
                    <Select
                      id="rejected_section"
                      name="rejected_section"
                      options={section}
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={section.filter(val =>
                        values.rejected_section?.includes(val.value)
                      )}
                      onChange={e => {
                        // console.log(e, "checke");
                        if (e) {
                          setValues({
                            ...values,
                            rejected_section: e.map(val => val.value)
                          });
                        }
                      }}
                    />
                    <Error field="rejected_section" />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className="col-12">
                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    name="comment"
                    id="comment"
                    className="form-control"
                    placeholder="Enter comment"
                    defaultValue={values.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    cols={10}
                    rows={3}
                    disabled={isbuttonHide}
                  />
                  <Error field="comment" />
                </div>
              </div>
              {!isbuttonHide ? (
                <div className="col-12 text-right mt-3">
                  <button
                    className="btn btn-blue mr-3"
                    onClick={() => {
                      handleEditKyc();
                    }}
                  >
                    Submit
                  </button>
                  <button
                    className="btn modalcancelbutton"
                    onClick={() => {
                      history.goBack();
                    }}
                  >
                    Back
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
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
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error })
)(Adminkycedit);
