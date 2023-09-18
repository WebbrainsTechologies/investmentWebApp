import React, { useEffect, useRef, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import detail_img from "../../../assets/images/selfiimage.svg";
import { editKyc } from "services/kycServices";
import enhancer from "./enhancer/UserselfiEnhancer";
import { formate_image_upload_error, image_small_size } from "helper/constant";

const { success, error, fetching, setActiveStep } = NavigationActions;

export const UserSelfi = props => {
  const [btnDisable, setBtnDisable] = useState(false);
  const [inputFirstName, setInputFirstName] = useState("");
  const inputFileName = useRef(null);

  const {
    setActiveStep,
    activeStep,
    setValues,
    values,
    handleBlur,
    errors,
    touched,
    submitCount,
    kycdetails,
    handleSubmit,
    isValid,
    token,
    setKycdetails,
    setComment
  } = props;

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
  // console.log(kycdetails?._id, "checkid46");
  const handleEditKyc = async () => {
    handleSubmit();
    if (isValid) {
      let formData = new FormData();
      formData.append(
        "selfi_image",
        values.front_image_currentFile === null
          ? values.front_image
          : values.front_image_currentFile
      );
      formData.append("status", "Pending");
      formData.append("step", 4);
      formData.append("comment", "");
      await editKyc(token, kycdetails?._id, formData).then(res => {
        if (res.success) {
          setKycdetails(res.data?._doc);
          setActiveStep(4);
          setComment("");
          setBtnDisable(false);
          success("Kyc is submitted and it takes 24-48 hrs to approval");
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
    kycdetails &&
      setValues({
        ...values,
        front_image: kycdetails.selfi_image,
        front_image_currentFile: null
      });
  }, []);

  return (
    <div className="card p-4">
      <div className="row justify-content-center">
        <div className="col-12 text-center mb-4">
          <p> Upload {kycdetails.document_type} Front and back image</p>
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
                style={{ borderRadius: "50%" }}
              >
                {/* {console.log(
                  values.front_image === "",
                  "checkcondition",
                  values.front_image
                )} */}
                {values.front_image === "" && (
                  <>
                    <img
                      src={detail_img}
                      className="detail-img userprofileimage"
                      alt="default"
                    />
                    <span className="file-placeholder">Add front image</span>
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
            <Error field="front_image" />
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
            Submit
          </button>
        </div>
      </div>
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
)(UserSelfi);
