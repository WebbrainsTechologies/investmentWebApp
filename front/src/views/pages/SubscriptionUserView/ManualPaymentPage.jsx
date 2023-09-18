import React, { useEffect, useState } from "react";

import {
  useParams,
  withRouter
} from "react-router-dom/cjs/react-router-dom.min";
import { getSubscriptionDetailById } from "services/subscriptionServices";
import navigationAction from "redux/navigation/actions";
import { compose } from "redux";
import { connect } from "react-redux";
import CopyButton from "../admin/CopyButton";
import { addUserSubscription } from "services/userSubscriptionServices";
import ManualPaymentEnhancer from "./enhancer/ManualPaymentPageEnhancer";
import terms_condition_pdf from "../../../assets/termsandconditions/GTC-SF.pdf";
import ManualPaymentComponent from "./ManualPaymentComponent";

const { success, error, fetching } = navigationAction;
function ManualPaymentPage(props) {
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [showOnMeta, setShowOnmeta] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState({});

  const [subscriptionMinimumAmount, setSubscriptionMinimumAmount] = useState(
    ""
  );
  const [currencyId, setCurrencyId] = useState("");

  const { user, token, history } = props;
  let { id } = useParams();

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
  } = props;
  // console.log(
  //   "Subscription Amount",
  //   subscriptionMinimumAmount,
  //   subscriptionAmount
  // );

  // const getSubscriptionData = async () => {
  //   await getSubscriptionDetailById(token, id).then((res) => {
  //     if (res.success) {
  //       console.log("res", res);
  //       console.log(res.data);
  //       success(res.message);
  //       setSubscriptionData(res.data);
  //     } else {
  //       error(res.message);
  //     }
  //   });
  // };
  // useEffect(() => {
  //   getSubscriptionData();
  // }, [id]);

  const getSubscriptionById = async () => {
    await getSubscriptionDetailById(token, id).then(res => {
      if (res.success) {
        setValues({
          ...res.data,
          quantity: 1,
          terms_condition: false,
          other_terms_condition: false
        });
        setSubscriptionData(res.data);
        setSubscriptionAmount(res.data?.amount);
        setSubscriptionMinimumAmount(res.data?.minimum_value);
        setCurrencyId(res.data?.currencyId);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getSubscriptionById();
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
    <div className="container-fluid">
      {showOnMeta === true ? (
        // <form>
        //   <div className="row">
        //     <div className="col-12">
        //       <div className="form-group">
        //         <label>
        //           Amount <span className="red">*</span>
        //         </label>
        //         <input
        //           type="text"
        //           className="form-control react-form-input"
        //           id="amount"
        //           value={subscriptionAmount}
        //           disabled
        //           readOnly
        //           placeholder="Package Amount"
        //         />
        //       </div>
        //     </div>
        //     <div className="col-12">
        //       <div className="form-group">
        //         <label>
        //           Quantity <span className="red">*</span>
        //         </label>
        //         <div className="quantity-row">
        //           <button
        //             className="plusminusbtn"
        //             onClick={e => {
        //               e.preventDefault();
        //               setValues({
        //                 ...values,
        //                 quantity:
        //                   Number(values.quantity) > 1
        //                     ? Number(values.quantity) - 1
        //                     : 1,
        //                 amount:
        //                   Number(subscriptionAmount) *
        //                   (Number(values.quantity) > 1
        //                     ? Number(values.quantity) - 1
        //                     : 1)
        //               });
        //             }}
        //           >
        //             -
        //           </button>
        //           <input
        //             type="text"
        //             className="form-control react-form-input pluminusinput"
        //             id="quantity"
        //             value={values.quantity}
        //             placeholder="Package Amount"
        //             onChange={e => {
        //               setValues({
        //                 ...values,
        //                 quantity: e.target.value,
        //                 amount:
        //                   Number(subscriptionAmount) * Number(e.target.value)
        //               });
        //             }}
        //             onBlur={handleBlur}
        //           />
        //           <button
        //             className="plusminusbtn"
        //             onClick={e => {
        //               e.preventDefault();
        //               console.log(values, "checkvalues139");
        //               setValues({
        //                 ...values,
        //                 quantity: Number(values.quantity) + 1,
        //                 amount:
        //                   Number(subscriptionAmount) *
        //                   (Number(values.quantity) + 1)
        //               });
        //             }}
        //           >
        //             +
        //           </button>
        //         </div>
        //         <Error field="quantity" />
        //       </div>
        //     </div>
        //     <div className="col-12 mb-2">
        //       <span>Minimum buy value {Number(values.minimum_value)}</span>
        //     </div>
        //     <div className="col-12 mb-2">
        //       Total value : {Number(values.amount)}
        //       <div>
        //         <Error field="amount" />
        //       </div>
        //       {/* {Number(subscriptionData?.amount) * Number(values.quantity)} */}
        //     </div>
        //     <div className="col-12 mb-3">
        //       <div className="form-check">
        //         <input
        //           type="checkbox"
        //           className="form-check-input"
        //           id="exampleCheck1"
        //           checked={values.terms_condition}
        //           onChange={e => {
        //             setValues({ ...values, terms_condition: e.target.checked });
        //           }}
        //           onBlur={handleBlur}
        //         />
        //         <label
        //           className="form-check-label register-privacy-text"
        //           htmlFor="exampleCheck1"
        //         >
        //           Agree to{" "}
        //           <a
        //             href={terms_condition_pdf}
        //             className="link-label"
        //             target="_blank"
        //             rel="noreferrer"
        //           >
        //             terms & privacy policy
        //           </a>
        //         </label>
        //       </div>
        //       <Error field="terms_condition" />
        //     </div>
        //     <div className="col-12 mb-3">
        //       <div className="form-check">
        //         <input
        //           type="checkbox"
        //           className="form-check-input"
        //           id="exampleCheck2"
        //           checked={values.other_terms_condition}
        //           onChange={e => {
        //             setValues({
        //               ...values,
        //               other_terms_condition: e.target.checked
        //             });
        //           }}
        //           onBlur={handleBlur}
        //         />
        //         <label
        //           className="form-check-label register-privacy-text"
        //           htmlFor="exampleCheck2"
        //           style={{ textAlign: "justify" }}
        //         >
        //           By ticking the box, I am aware that Company Provide 75%
        //           withdrawal of My principle amount. And the execution of the
        //           Company contract before the expiry of the revocation period
        //           and confirm my knowledge that by this consent I lose my
        //           execution of the Company contract.
        //         </label>
        //       </div>
        //       <Error field="other_terms_condition" />
        //     </div>
        //     <div className="col-12 mb-2"></div>
        //     <div className="col-12">
        //       <div className="row justify-content-end">
        //         <div className="col">
        //           <button
        //             onClick={e => {
        //               e.preventDefault();
        //               handleSubmit();
        //               console.log("isValid", isValid);
        //               console.log(errors, "errors");

        //               // if (isValid) {
        //               //   setShowOnmeta(false)
        //               // }
        //               if (
        //                 !Object.keys(errors).includes("amount") &&
        //                 !Object.keys(errors).includes("terms_condition") &&
        //                 !Object.keys(errors).includes("other_terms_condition")
        //               ) {
        //                 setShowOnmeta(false);
        //               }
        //             }}
        //             type="submit"
        //             className="btn btn-blue w-100"
        //             // disabled={isValid ? false : true}
        //           >
        //             Proceed
        //           </button>
        //         </div>
        //         <div className="col">
        //           <button
        //             onClick={e => {
        //               e.preventDefault();
        //               // console.log(history, "checkhistory");
        //               history.goBack();
        //             }}
        //             className="btn form-button modalcancelbutton"
        //           >
        //             Cancel
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </form>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-5">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <h2 class="secure-box-title justify-content-between">
                Package Details
              </h2>
              <div className="secure-box-body">
                <form>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group secure-form-group">
                        <label>
                          Amount <span className="red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          id="amount"
                          value={subscriptionAmount}
                          disabled
                          readOnly
                          placeholder="Package Amount"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group secure-form-group">
                        <label>
                          Quantity <span className="red">*</span>
                        </label>
                        <div className="quantity-row">
                          <button
                            className="plusminusbtn"
                            onClick={e => {
                              e.preventDefault();
                              setValues({
                                ...values,
                                quantity:
                                  Number(values.quantity) > 1
                                    ? Number(values.quantity) - 1
                                    : 1,
                                amount:
                                  Number(subscriptionAmount) *
                                  (Number(values.quantity) > 1
                                    ? Number(values.quantity) - 1
                                    : 1)
                              });
                            }}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control react-form-input pluminusinput"
                            id="quantity"
                            value={values.quantity}
                            placeholder="Package Amount"
                            onChange={e => {
                              setValues({
                                ...values,
                                quantity: e.target.value,
                                amount:
                                  Number(subscriptionAmount) *
                                  Number(e.target.value)
                              });
                            }}
                            onBlur={handleBlur}
                          />
                          <button
                            className="plusminusbtn"
                            onClick={e => {
                              e.preventDefault();
                              // console.log(values, "checkvalues139");
                              setValues({
                                ...values,
                                quantity: Number(values.quantity) + 1,
                                amount:
                                  Number(subscriptionAmount) *
                                  (Number(values.quantity) + 1)
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                        <Error field="quantity" />
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <div className="min-total-row">
                        <span className="min-total-value">
                          Minimum buy value{" "}
                          <span>{Number(values.minimum_value)}</span>
                        </span>
                        <span className="min-total-value">
                          Total value : <span>{Number(values.amount)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div>
                        <Error field="amount" />
                      </div>
                      {/* {Number(subscriptionData?.amount) * Number(values.quantity)} */}
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-check secure-form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                          checked={values.terms_condition}
                          onChange={e => {
                            setValues({
                              ...values,
                              terms_condition: e.target.checked
                            });
                          }}
                          onBlur={handleBlur}
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
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-check secure-form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck2"
                          checked={values.other_terms_condition}
                          onChange={e => {
                            setValues({
                              ...values,
                              other_terms_condition: e.target.checked
                            });
                          }}
                          onBlur={handleBlur}
                        />
                        <label
                          className="form-check-label register-privacy-text"
                          htmlFor="exampleCheck2"
                          style={{ textAlign: "justify" }}
                        >
                          By ticking the box, I am aware that Company shall
                          provide max upto 75% withdrawal of my principle amount
                          in case early closure of the contract. I confirm my
                          knowledge that by this consent, I lose my execution of
                          the company contract for the remaining term.
                        </label>
                      </div>
                      <Error field="other_terms_condition" />
                    </div>
                    <div className="col-12 mb-2"></div>
                    <div className="col-12">
                      <div className="row justify-content-end">
                        <div className="col-sm">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              // console.log(history, "checkhistory");
                              history.goBack();
                            }}
                            className="btn form-button modalcancelbutton"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-sm">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              handleSubmit();
                              if (
                                !Object.keys(errors).includes("amount") &&
                                !Object.keys(errors).includes(
                                  "terms_condition"
                                ) &&
                                !Object.keys(errors).includes(
                                  "other_terms_condition"
                                )
                              ) {
                                setShowOnmeta(false);
                              }
                            }}
                            type="submit"
                            className="btn btn-blue w-100 mt-2 mt-sm-0"
                            // disabled={isValid ? false : true}
                          >
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ManualPaymentComponent
          totalvalue={Number(values.amount)}
          subscriptionData={subscriptionData}
          changeOnMeta={() => {
            setShowOnmeta(true);
          }}
        />
      )
      //   ( <div className="row  border rounded border">
      //   <div className="col-12 justify-content-end align-items-center border-secondary rounded border ">
      //     <div className="float-left  p-5  border-secondary rounded border">
      //       <div
      //         className="subscription-box-details-manual "
      //         style={{ border: "none" }}
      //       >
      //         <div className="row">
      //           <div className="col-12 m-2 p-2 d-flex flex-row justify-content-center align-items-center">
      //             <p>Name: {subscriptionData.name}</p>
      //           </div>
      //           <div className="col-12  m-2 p-2 d-flex flex-row justify-content-center align-items-center ">
      //             <p>Amount: {subscriptionData.amount}</p>{" "}
      //           </div>
      //           <div className="col-12  m-2 p-2 d-flex flex-row justify-content-center align-items-center">
      //             <p>Rate Of Interest: {subscriptionData.roi}</p>
      //           </div>
      //           <div className="col-12  m-2 p-2 d-flex flex-row justify-content-center align-items-center">
      //             <p>
      //               Rate Of Interest Duration: {subscriptionData.roi_duration}
      //             </p>
      //           </div>
      //         </div>
      //       </div>
      //     </div>

      //     <div className="float-right  p-5  border-secondary rounded border">
      //       <p className="mt-2 mb-2 ml-5">Scan with your TRON wallet</p>
      //       <img
      //         src={QRcode}
      //         alt="qr code"
      //         className="qr-code-image mt-2 mb-2"
      //       />
      //       <p className="mt-2 mb-2 ml-5 pl-4">Or click on this link</p>
      //       <a href="#" className="qr-link ml-3">
      //         https://cult.honeypot.io/reads/6-best-react-communities-to-get-information-and-support/
      //       </a>
      //     </div>
      //   </div>
      //   <div className="Alert-container">
      //     <Alert
      //       color="warning"
      //       className="Manual-alert alert-box border-warning "
      //     >
      //       <img src={alerticon} alt="" className="alerticon m-2 " />
      //       <span className="font-weight-bold">Attention! </span>{" "}
      //       <span>
      //         Please make payments only via your private TRON wallets . Direct
      //         payments from exchanges and exchanges services are forbidden{" "}
      //       </span>
      //     </Alert>
      //   </div>
      //   <div className="col-12 qr-payment-details border-secondary rounded border">
      //     <div className="row">
      //       <div className="col-4 pl-4 pt-2 ">
      //         <span className="manual-text">Alternatively send exactly :</span>
      //       </div>
      //       <div className="col-4 "></div>
      //       <div className="col-4">
      //         <span className="font-weight-bold">
      //           {" "}
      //           <CopyButton
      //             referralCode={`${subscriptionMinimumAmount} USDT`}
      //             style={{
      //               width: "150px",
      //               fontSize: "20px",
      //               border: "none",
      //               marginTop: "10px",
      //               marginBottom: "10px",
      //               marginRight: "10px",
      //             }}
      //           />{" "}
      //         </span>
      //       </div>
      //     </div>
      //     <div className="row ">
      //       <div className="col-4  pl-4 pt-2 ">
      //         <span className="manual-text">To this address: </span>
      //       </div>
      //       <div className="col-4 "></div>
      //       <div className="col-4 ">
      //         <span className="font-weight-bold">
      //           <CopyButton
      //             referralCode={"baPnRRTF8aPnRRTF8"}
      //             style={{
      //               width: "150px",
      //               border: "none",
      //               fontSize: "20px",
      //               marginTop: "10px",
      //               marginBottom: "10px",
      //               marginRight: "10px",
      //             }}
      //           />{" "}
      //         </span>
      //       </div>
      //     </div>
      //   </div>

      //   {/* new input */}
      //   <div className="col-12">
      //     <input
      //       type="file"
      //       id="manual_purchase_image "
      //       accept=".jpg,.png,.jpeg,.svg"
      //       className="mr-2 mt-4 mb-3 p-2"
      //       // value={values.profile_img}
      //       onBlur={()=>{
      //         setFieldTouched(true)
      //       }}
      //       onChange={(e) => {
      //         if (e.target.files[0]) {
      //           if (
      //             ["png", "jpg", "jpeg", "svg+xml"].includes(
      //               e.target.files[0]?.type.split("/")[1]
      //             )
      //           ) {
      //             console.log(e.target.files[0]);
      //             setValues({
      //               ...values,
      //               current_file: URL.createObjectURL(
      //                 e.target.files[0]
      //               ),
      //               manual_purchase_image:e.target.files[0],
      //             });
      //           } else {
      //             error(
      //               "This file format is not accepted. You can upload only SVG, JPEG, JPG, and PNG Files"
      //             );
      //           }
      //         }
      //       }}
      //     />{console.log("touched,errors",touched,errors)}

      //     <p></p>
      //     {(touched.manual_purchase_image || touched.current_file) && errors['manual_purchase_image'] || errors['current_file'] ? (<span className="text-danger">{errors.manual_purchase_image}</span>):null}

      //     {values.manual_purchase_image !== "" && (
      //       <div>
      //         <img
      //           src={
      //             values.current_file === null
      //               ? `${process.env.REACT_APP_UPLOAD_DIR}${values.manual_purchase_image}`
      //               : values.current_file
      //           }
      //           className="manual-payment-image"
      //           alt="no"
      //         />
      //       </div>
      //     )}
      //     {values.manual_purchase_image ? (
      //       <label
      //         className="blue-link cursor trash-button"
      //         htmlFor="manual_purchase_image"
      //         // onClick={this.uploadImg}
      //       >
      //         <XCircle
      //           onClick={() => {
      //             setValues({ ...values, manual_purchase_image: "" });
      //           }}
      //         />
      //       </label>
      //     ) : null}

      //   </div>

      //   {/* new input */}
      //   <div className="mt-4 mb-3  Alert-container ">
      //     <Alert
      //       color="light"
      //       className=" border-secondary rounded border alert-box"
      //     >
      //       <img src={alerticon} alt="" className="alerticon m-2 " />{" "}
      //       <span className="font-weight-bold color-dark ">
      //         Please note that senders are charged commissions. Make sure that
      //         amount you send will cover the fee
      //       </span>
      //     </Alert>{" "}
      //   </div>
      //   <div className="col-12">
      //     <div className="row">
      //     <div className="col-6">
      //     <button className="btn btn-blue subscriptionbtn float-right mb-3 " onClick={()=>handleSubmitAction()}>Submit </button>
      //     </div>
      //     <div className="col-6">

      //     </div>
      //     {/* <div className="col-4 "></div> */}

      //     </div>

      //   </div>
      // </div>)
      }
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
  ManualPaymentEnhancer,
  connect(mapStateToProps, { success, error, fetching })
)(ManualPaymentPage);
