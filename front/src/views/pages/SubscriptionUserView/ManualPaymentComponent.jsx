import React, { useState } from "react";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  useParams,
  withRouter
} from "react-router-dom/cjs/react-router-dom.min";
import QRcode from "assets/images/QR_code.jpg";
import { Alert } from "reactstrap";
import alerticon from "assets/images/alert-icon.svg";
import CopyButton from "../admin/CopyButton";
import { addUserSubscription } from "services/userSubscriptionServices";
import { XCircle } from "react-feather";
import { compose } from "redux";
import navigationAction from "redux/navigation/actions";
const { success, error, fetching } = navigationAction;

function ManualPaymentComponent(props) {
  const {
    user,
    token,
    totalvalue,
    subscriptionData,
    history,
    changeOnMeta
  } = props;
  let { id } = useParams();
  let [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const {
    values,
    setValues,
    handleSubmit,
    isValid,
    errors,
    touched,
    submitCount,
    setFieldTouched,
    handleBlur
  } = useFormik({
    initialValues: {
      manual_purchase_image: "",
      current_file: ""
    },
    // validateOnMount: true,
    validationSchema: Yup.object().shape({
      manual_purchase_image: Yup.string().required("Please select image"),
      current_file: Yup.string().required("Please select image")
    }),
    handleSubmit: values => {},
    displayName: "CustomValidationForm",
    enableReinitialize: true
  });

  async function handleSubmitAction() {
    handleSubmit();
    // console.log("values", values);
    // console.log("errors", errors);

    if (isValid && values.manual_purchase_image) {
      let formData = new FormData();
      formData.append("manual_purchase_image", values.manual_purchase_image);
      formData.append("amount", Number(totalvalue));
      formData.append("investment_type", "manually");

      await addUserSubscription(token, id, formData).then(res => {
        if (res.success) {
          // console.log("res data", res.data);
          success(res.message);
          setSubmitDisabled(false);
          history.push("/packages");
        } else {
          error(res.message);
          setSubmitDisabled(false);
        }
      });
    }
    setSubmitDisabled(false);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-xl-10">
        <div className="secure-admin-box mb-5 mb-sm-0">
          <div className="secure-box-body">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="min-total-row min-total-row-2 flex-column mt-0">
                      <span class="min-total-value min-total-value-between">
                        Name: <span>{subscriptionData.name}</span>
                      </span>
                      <span class="min-total-value min-total-value-between">
                        Amount: <span>{subscriptionData.amount}</span>
                      </span>
                      <span class="min-total-value min-total-value-between">
                        Rate Of Interest: <span>{subscriptionData.roi}</span>
                      </span>
                      <span class="min-total-value min-total-value-between">
                        Rate Of Interest Duration:{" "}
                        <span>{subscriptionData.roi_duration}</span>
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-6 mt-3 mt-lg-0">
                    <div className="manual-qr-box">
                      <p>Scan with your TRC20 wallet</p>
                      <img
                        src={QRcode}
                        alt="qr code"
                        className="qr-code-image mt-2 mb-2"
                      />
                      {/* <p>Or click on this link</p>
                      <a href="#" className="qr-link  ">
                        https://cult.honeypot.io/reads/6-best-react-communities-to-get-information-and-support/
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="Alert-container">
                  <Alert
                    color="warning"
                    className="Manual-alert payment-alert alert-box border-warning"
                  >
                    <img src={alerticon} alt="" className="alerticon m-2 " />
                    <span className="font-weight-bold">Attention! </span>{" "}
                    <span>
                      Please make payments only via your private TRC20 wallets .
                      Direct payments from exchanges and exchanges services are
                      forbidden{" "}
                    </span>
                  </Alert>
                </div>
                <div className="exactly-address-row">
                  <span className="manual-text">
                    <span>Alternatively send exactly :</span>
                    <span className="font-weight-bold big-input-font width-calc-150">
                      <CopyButton referralCode={`${totalvalue} USDT`} />
                    </span>
                  </span>
                  <span className="manual-text">
                    <span>Network Type :</span>
                    <span className="font-weight-bold width-calc-150">
                      <CopyButton referralCode={"TRC20"} />{" "}
                    </span>
                  </span>
                  <span className="manual-text">
                    <span>To this address :</span>
                    <span className="font-weight-bold width-calc-150">
                      <CopyButton
                        referralCode={"TVkd4JDZpZRgQ8UdGS7mvGpaS2zWZkPnEv"}
                      />{" "}
                    </span>
                  </span>
                </div>
                <div className="choose-image-row">
                  <p>
                    Attach Image{" "}
                    <small>
                      (Please upload an image showing the successful
                      transaction.)
                    </small>
                  </p>

                  <input
                    type="file"
                    id="manual_purchase_image "
                    accept=".jpg,.png,.jpeg,.svg"
                    // value={values.profile_img}
                    onBlur={() => {
                      setFieldTouched(true);
                    }}
                    onChange={e => {
                      if (e.target.files[0]) {
                        // console.log(e.target.files[0], "file check");
                        if (
                          ["png", "jpg", "jpeg", "svg+xml"].includes(
                            e.target.files[0]?.type.split("/")[1]
                          )
                        ) {
                          setValues({
                            ...values,
                            current_file: URL.createObjectURL(
                              e.target.files[0]
                            ),
                            manual_purchase_image: e.target.files[0]
                          });
                        } else {
                          error(
                            "This file format is not accepted. You can upload only SVG, JPEG, JPG, and PNG Files"
                          );
                        }
                      }
                    }}
                  />
                  {/* {console.log(
                    "manual purchase image,current file",
                    values.manual_purchase_image,
                    values.current_file
                  )} */}
                  {((touched.manual_purchase_image || touched.current_file) &&
                    errors["manual_purchase_image"]) ||
                  errors["current_file"] ? (
                    <span className="text-danger">
                      {errors.manual_purchase_image}
                    </span>
                  ) : null}

                  <div className="position-relative d-inline-block mt-4">
                    {values.manual_purchase_image !== "" && (
                      <div>
                        <img
                          src={
                            values.current_file === null
                              ? `${process.env.REACT_APP_UPLOAD_DIR}${values.manual_purchase_image}`
                              : values.current_file
                          }
                          className="manual-payment-image"
                          alt="no"
                        />
                      </div>
                    )}
                    {values.manual_purchase_image ? (
                      <label
                        className="blue-link cursor trash-button"
                        htmlFor="manual_purchase_image"
                        // onClick={this.uploadImg}
                      >
                        <XCircle
                          onClick={() => {
                            setValues({
                              ...values,
                              manual_purchase_image: "",
                              current_file: ""
                            });
                          }}
                        />
                      </label>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="col-12  Alert-container ">
                <Alert
                  color="light"
                  className=" border-secondary rounded border alert-box"
                >
                  <img src={alerticon} alt="" className="alerticon m-2 " />{" "}
                  <span className="font-weight-bold color-dark ">
                    Please note that senders are charged commissions. Make sure
                    that amount you send will cover the fee
                  </span>
                </Alert>{" "}
              </div>
              <div className="col-12">
                <div className="row justify-content-center">
                  <div className="col-auto">
                    <button
                      className="btn form-button modalcancelbutton"
                      onClick={() => {
                        changeOnMeta();
                      }}
                    >
                      Cancel{" "}
                    </button>
                  </div>
                  <div className="col-auto mt-2 mt-sm-0">
                    <button
                      className="btn btn-blue"
                      onClick={() => {
                        setSubmitDisabled(true);
                        handleSubmitAction();
                      }}
                      disabled={isSubmitDisabled}
                    >
                      Submit{" "}
                    </button>
                  </div>
                  {/* <div className="col-6">
        
        </div> */}
                  {/* <div className="col-4 "></div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching })
)(ManualPaymentComponent);
