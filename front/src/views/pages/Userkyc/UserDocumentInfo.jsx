import React, { useEffect, useRef, useState } from "react";
import enhancer from "./enhancer/UserdocumentinfoEnhancer";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { editKyc } from "services/kycServices";
import front_detail_img from "../../../assets/images/frontimage.svg";
import back_detail_img from "../../../assets/images/backimage.svg";
import { formate_image_upload_error, image_small_size } from "helper/constant";

const { success, error, fetching } = NavigationActions;

const UserDocumentInfo = props => {
  const inputFileName = useRef(null);
  const inputFileBack = useRef(null);
  const [isopen, setIsOpen] = useState(false);
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputSecondName, setInputSecondName] = useState("");
  const {
    setActiveStep,
    activeStep,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    submitCount,
    setValues,
    kycdetails,
    handleSubmit,
    token,
    setKycdetails,
    isValid
  } = props;
  const [btnDisable, setBtnDisable] = useState(false);

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
  const handleEditKyc = async () => {
    handleSubmit();
    if (isValid) {
      let formData = new FormData();
      formData.append("document_type", values.document_type);
      formData.append(
        "front_image",
        values.front_image_currentFile === null
          ? values.front_image
          : values.front_image_currentFile
      );
      formData.append(
        "back_image",
        values.back_image_currentFile === null
          ? values.back_image
          : values.back_image_currentFile
      );
      await editKyc(token, kycdetails?._id, formData).then(res => {
        // console.log(res, "check66");
        if (res.success) {
          // console.log(res.data, "check64");
          setKycdetails(res.data?._doc);
          setActiveStep(activeStep + 1);
          setBtnDisable(false);
        } else {
          error(res.message);
          setBtnDisable(false);
        }
      });
    } else {
      setBtnDisable(false);
    }
  };
  useEffect(() => {
    // console.log(kycdetails, "chcek73");
    kycdetails &&
      setValues({
        ...values,
        front_image: kycdetails.front_image,
        back_image: kycdetails.back_image,
        document_type: kycdetails.document_type,
        front_image_currentFile: null,
        back_image_currentFile: null
      });
    if (kycdetails?.front_image && kycdetails?.back_image) {
      setIsOpen(true);
    }
  }, []);
  return (
    <div className="card p-4">
      {!isopen ? (
        <div className="row text-center">
          <div className="col-xl-4 mb-3 mb-xl-0">
            <button
              className="btn document-btn"
              onClick={() => {
                setIsOpen(true);
                setValues({ ...values, document_type: "Passport" });
              }}
            >
              <i class="fas fa-passport"></i> Passport
            </button>
          </div>
          <div className="col-xl-4 mb-3 mb-xl-0">
            <button
              className="btn document-btn"
              onClick={() => {
                setIsOpen(true);
                setValues({ ...values, document_type: "Identity Card" });
              }}
            >
              <i class="fas fa-id-card"></i> Identity Card
            </button>
          </div>
          <div className="col-xl-4">
            <button
              className="btn document-btn"
              onClick={() => {
                setIsOpen(true);
                setValues({ ...values, document_type: "Driving License" });
              }}
            >
              <i class="far fa-id-badge"></i> Driving License
            </button>
          </div>
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-4">
            <p> Upload {values.document_type} Front and back image</p>
            <p>
              Upload a color image of the entire document.Screenshots are not
              allowed.JPE,JPEG or PNG format only.Size less than 5 MB
            </p>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              <label>
                Front Image <span className="red">*</span>
              </label>
              <input
                type="file"
                hidden
                name="front_image"
                ref={inputFileName}
                className="form-control react-form-input"
                id="front_image"
                accept=".jpg,.png,.jpeg,"
                onChange={e => {
                  if (Math.round(e.target.files[0].size / 1000) <= 5120) {
                    if (
                      ["png", "jpg", "jpeg"].includes(
                        e.target.files[0]?.type.split("/")[1]
                      )
                    ) {
                      setValues({
                        ...values,
                        front_image_currentFile: e.target.files[0],
                        front_image: URL.createObjectURL(e.target.files[0])
                      });
                      setInputFirstName(
                        inputFileName.current.value?.split("\\").pop()
                      );
                    } else {
                      error(formate_image_upload_error);
                    }
                  } else {
                    error(image_small_size);
                  }
                }}
                onBlur={handleBlur}
              />
              <div className="file-group">
                <label
                  className="detail-img-wrap mb-0 cursor flex-wrap"
                  htmlFor="front_image"
                  // style={{ borderRadius: "50%" }}
                >
                  {/* {console.log(
                    values.front_image === "",
                    "checkcondition",
                    values.front_image
                  )} */}
                  {values.front_image === "" && (
                    <>
                      <img
                        src={front_detail_img}
                        className="detail-img userprofileimage"
                        alt="default"
                      />
                      <p className="file-placeholder">Add front image</p>
                    </>
                  )}
                  {values.front_image !== "" && (
                    <>
                      <img
                        src={
                          values.front_image_currentFile === null
                            ? `${process.env.REACT_APP_UPLOAD_DIR}${values.front_image}`
                            : values.front_image
                        }
                        className="profile-img patient_img"
                        alt="no"
                      />
                    </>
                  )}
                  <p>{inputFirstName}</p>
                </label>
              </div>
              {/* {console.log("called")} */}
              <Error field="front_image" />
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <div className="form-group">
              <label>
                Back Image <span className="red">*</span>
              </label>
              <input
                type="file"
                hidden
                name="back_image"
                ref={inputFileBack}
                className="form-control react-form-input"
                id="back_image"
                accept=".jpg,.png,.jpeg,"
                onChange={e => {
                  if (Math.round(e.target.files[0].size / 1000) <= 5120) {
                    if (
                      ["png", "jpg", "jpeg"].includes(
                        e.target.files[0]?.type.split("/")[1]
                      )
                    ) {
                      setValues({
                        ...values,
                        back_image_currentFile: e.target.files[0],
                        back_image: URL.createObjectURL(e.target.files[0])
                      });
                      setInputSecondName(
                        inputFileBack.current.value?.split("\\").pop()
                      );
                    } else {
                      error(formate_image_upload_error);
                    }
                  } else {
                    error(image_small_size);
                  }
                }}
                onBlur={handleBlur}
              />
              <div className="file-group">
                <label
                  className="detail-img-wrap mb-0 cursor flex-wrap"
                  htmlFor="back_image"
                  style={{ borderRadius: "50%" }}
                >
                  {values.back_image === "" && (
                    <>
                      <img
                        src={back_detail_img}
                        className="detail-img userprofileimage"
                        alt="default"
                      />
                      <p className="file-placeholder">Add back image</p>
                    </>
                  )}
                  {values.back_image !== "" && (
                    <>
                      <img
                        src={
                          values.back_image_currentFile === null
                            ? `${process.env.REACT_APP_UPLOAD_DIR}${values.back_image}`
                            : values.back_image
                        }
                        className="profile-img patient_img"
                        alt="no"
                      />
                    </>
                  )}
                  <p>{inputSecondName}</p>
                </label>
              </div>
              <Error field="back_image" />
            </div>
          </div>
          <div className="col-12 text-right">
            <button
              className="btn modalcancelbutton mr-3"
              onClick={() => {
                setActiveStep(activeStep - 1);
              }}
            >
              Back
            </button>
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
      )}
    </div>
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
  connect(mapStateToProps, { success, error, fetching })
)(UserDocumentInfo);
