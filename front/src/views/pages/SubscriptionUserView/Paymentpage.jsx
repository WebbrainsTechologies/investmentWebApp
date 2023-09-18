import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/PaymentpageEnhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import {
  addCurrency,
  editCurrency,
  getCurrencyById
} from "services/currencyServices";
import detail_img from "../../../assets/images/Frame 463426.svg";
import terms_condition_pdf from "../../../assets/termsandconditions/GTC-SF.pdf";
import {
  createOrder,
  featchOrderStatus,
  onMetaChoosePaymentMethod,
  onMetaFetchquotation,
  onMetaUserLogin,
  updateUtr
} from "services/onemetaapis";
import { getSubscriptionDetailById } from "services/subscriptionServices";
import { withRouter } from "react-router-dom";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import {
  addUserSubscription,
  changeSubscriberSubscriptionStatus
} from "services/userSubscriptionServices";
import { addonmetaLogs } from "services/onmetaLogsServices";

const { success, error } = NavigationActions;
const Paymentpage = props => {
  const inputFile = useRef(null);
  const {
    user,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    token,
    isValid,
    setValues,
    handleSubmit,
    toggleRefresh,
    history
  } = props;
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [isProceedThreeDisabled, setisProceedThreeDisabled] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [subscriptionMinimumAmount, setSubscriptionMinimumAmount] = useState(
    ""
  );
  const [paymentmethods, setPaymentMethods] = useState([]);
  const [localSubscriptionId, setLocalSubscriptionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("INR_UPI");
  const [firstModalOpen, setFirstModalOpen] = useState(true);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [thirdModalOpen, setThirdModalOpen] = useState(false);
  const [fourthModalOpen, setFourthModalOpen] = useState(false);
  const [countStart, setCountStart] = useState(false);
  const [currencyId, setCurrencyId] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [onmetaFeatchData, setOnmetaFeatchData] = useState({
    transactionFee: 0,
    receivedTokens: 0,
    conversionRate: 0,
    transactionFeeCurrency: ""
  });
  const [countdown, setCountdown] = useState(30);
  const [qrValue, setQrValue] = useState("");
  const [stopFatchQuatation, setStopFetchQuatation] = useState(true);
  const getUserAccessTokenFromOnMeta = async () => {
    await onMetaUserLogin({
      email: user?.email
    }).then(res => {
      if (res?.success) {
        setUseracessTokenByOnMeta(res.data?.accessToken);
      } else {
        error(res.message);
      }
    });
  };
  // console.log(useracessTokenByOnMeta, "check53");
  useEffect(() => {
    user?.email && getUserAccessTokenFromOnMeta();
  }, []);

  const getSubscriptionById = async () => {
    await getSubscriptionDetailById(token, id).then(res => {
      if (res.success) {
        setValues({
          ...res.data,
          quantity: 1,
          terms_condition: false,
          other_terms_condition: false
        });
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

  const getCurrencyDetails = async () => {
    await getCurrencyById(token, currencyId).then(res => {
      // console.log(res, "check83");
      if (res.success) {
        setCurrencyDetails(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    currencyId && getCurrencyDetails();
  }, [currencyId]);

  useEffect(() => {
    const interval = setInterval(() => {
      stopFatchQuatation &&
        countStart &&
        setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countStart, stopFatchQuatation]);

  useEffect(() => {
    if (countdown === 0) {
      setCountdown(30);
    }
  }, [countdown]);

  // console.log(currencyDetails, "check101", currencyId);
  const createUserOrder = async () => {
    let data = {
      buyTokenSymbol: currencyDetails?.symbol,
      chainId: currencyDetails.chainId,
      fiatCurrency: "INR",
      // fiatAmount: Number(values?.inr_amount) + 100,
      fiatAmount: Number(values?.inr_amount),
      // fiatAmount: 1000,
      // fiatAmount:
      //   Number(values?.inr_amount) > 100 ? Number(values?.inr_amount) - 100 : 0,
      buyTokenAddress: currencyDetails.address,
      receiverAddress: process.env.REACT_APP_ONMETA_RECIVER_ADDRESS,
      paymentMode: selectedPaymentMethod
    };
    await createOrder(useracessTokenByOnMeta, data).then(async res => {
      // console.log(res, "check141", values);
      let logdata = {
        url: `${
          process.env.REACT_APP_ONMETA_URI
            ? process.env.REACT_APP_ONMETA_URI
            : ""
        }/orders/create`,
        response: JSON.stringify(res),
        request: JSON.stringify(data)
      };
      await addonmetaLogs(token, logdata).then(res => {
        if (res.success) {
          console.log(res);
        } else {
          error(res.message);
        }
      });
      if (res?.success) {
        setOrderId(res?.data.orderId);
        if (res?.data?.redirect_actions?.qr_checkout_string) {
          setQrValue(res?.data?.redirect_actions?.qr_checkout_string);
        }
        setCountdown(30);
        setCountStart(false);
        setStopFetchQuatation(false);
        await addUserSubscription(token, id, {
          amount: Number(onmetaFeatchData.receivedTokens),
          onmeta_amount: onmetaFeatchData.receivedTokens,
          transfer_rate: onmetaFeatchData.conversionRate,
          // inr_amount: Number(values.inr_amount) + 100,
          inr_amount: Number(values.inr_amount),
          investment_type: "with_one_meta",
          onmeta_orderId: res.data.orderId,
          payment_method: selectedPaymentMethod
        }).then(res => {
          // console.log(res.data, "chckdata167");
          if (res.success) {
            success(res.message);
            setSubmitDisabled(false);
            setSecondModalOpen(false);
            setThirdModalOpen(true);
            setLocalSubscriptionId(res.data?._id);
          } else {
            error(res.message);
            setSubmitDisabled(false);
          }
        });
      } else {
        // console.log(res, "checkerror154");
        setSubmitDisabled(false);
        error(res.error.message);
      }
    });
  };

  const getFatchQuotationData = async () => {
    let data = {
      buyTokenSymbol: currencyDetails?.symbol,
      chainId: currencyDetails?.chainId,
      fiatCurrency: "inr",
      fiatAmount: Number(values?.inr_amount),
      buyTokenAddress: currencyDetails?.address
    };
    await onMetaFetchquotation(data).then(res => {
      // console.log(res, "check128");
      // console.log(res?.data.desiredOrder?.base?.gasCharge?.value, "check221");
      if (res?.success) {
        setCountStart(true);
        setOnmetaFeatchData({
          receivedTokens: res?.data.receivedTokens
            ? res?.data.receivedTokens
            : 0,
          transactionFee: res?.data.desiredOrder?.base?.gasCharge?.value
            ? res?.data.desiredOrder?.base?.gasCharge?.value
            : 0,
          conversionRate: res?.data.conversionRate
            ? res?.data.conversionRate
            : 0,
          transactionFeeCurrency: res?.data.desiredOrder?.base?.gasCharge
            ?.currency
            ? res?.data.desiredOrder?.base?.gasCharge?.currency
            : ""
        });
        setCountdown(30);
        setStopFetchQuatation(true);
      } else {
        setOnmetaFeatchData({
          receivedTokens: 0,
          transactionFee: 0,
          conversionRate: 0,
          transactionFeeCurrency: ""
        });
      }
    });
  };
  // console.log(values.inr_amount, "check133");
  const getPaymentMethods = async () => {
    await onMetaChoosePaymentMethod().then(res => {
      if (res?.success) {
        res?.data?.length > 0 &&
          res?.data?.map(val => {
            if (val.currencyCode === "INR") {
              setPaymentMethods(val.paymentModes);
            }
          });
      }
    });
  };
  useEffect(() => {
    secondModalOpen && getPaymentMethods();
  }, [secondModalOpen]);
  console.log(paymentmethods, "check273");
  useEffect(() => {
    const timeout = setInterval(() => {
      secondModalOpen && values?.inr_amount && getFatchQuotationData();
    }, 30000);
    // console.log(values.inr_amount, "check134");
    return () => clearTimeout(timeout);
  }, [values.inr_amount, secondModalOpen]);

  // useEffect(() => {
  //   values.inr_amount && getFatchQuotationData();
  // }, [values.inr_amount]);

  useEffect(() => {
    if (values.inr_amount) {
      const timeOutId = setTimeout(() => {
        setCountdown(30);
        setStopFetchQuatation(false);
        getFatchQuotationData();
      }, 1000);
      return () => clearTimeout(timeOutId);
    }
    //eslint-disable-next-line
  }, [values.inr_amount]);

  const updateUserOrderUtr = async () => {
    let data = {
      orderId: orderId,
      utr: values.utr_value
    };
    await updateUtr(useracessTokenByOnMeta, data).then(async res => {
      // console.log(res, "check124");
      let logdata = {
        url: `${
          process.env.REACT_APP_ONMETA_URI
            ? process.env.REACT_APP_ONMETA_URI
            : ""
        }/orders/utr`,
        response: JSON.stringify(res),
        request: JSON.stringify(data)
      };
      await addonmetaLogs(token, logdata).then(res => {
        if (res.success) {
          console.log(res);
        } else {
          error(res.message);
        }
      });
      if (res.success) {
        await featchOrderStatus(useracessTokenByOnMeta, {
          orderId: data.orderId
        }).then(async res => {
          // console.log(res, "check239");
          let logdata = {
            url: `${
              process.env.REACT_APP_ONMETA_URI
                ? process.env.REACT_APP_ONMETA_URI
                : ""
            }/orders/status`,
            response: JSON.stringify(res),
            request: JSON.stringify({
              orderId: data.orderId
            })
          };
          await addonmetaLogs(token, logdata).then(res => {
            if (res.success) {
              console.log(res);
            } else {
              error(res.message);
            }
          });
          if (res.success) {
            if (
              !(
                res.data?.status === "fiatPending" ||
                res.data?.status === "InProgress" ||
                res.data?.status === "expired"
              )
            ) {
              await changeSubscriberSubscriptionStatus(
                token,
                localSubscriptionId,
                {
                  usersubscriptionstatus:
                    res.data?.status === "cancelled" ? "Cancelled" : "Accepted",
                  userId: user._id,
                  onemeta_reason: res.data?.reason ? res.data?.reason : ""
                }
              ).then(res => {
                if (res.success) {
                  success(res.message);
                  setisProceedThreeDisabled(false);
                } else {
                  // console.log("here here here 1");
                  error(res.message);
                  setisProceedThreeDisabled(false);
                }
              });
            }
          } else {
            error(res?.error?.message);
            // console.log("here here here 2");
            setisProceedThreeDisabled(false);
          }
          history.push("/packages");
        });
      } else {
        error(res?.error?.message);
        setisProceedThreeDisabled(false);
        // console.log("here here here 3");
      }
    });
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
      {firstModalOpen ? (
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
        //               if (isValid) {
        //                 setFirstModalOpen(false);
        //                 setSecondModalOpen(true);
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
              <h2 className="secure-box-title justify-content-between">
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
                    <div className="col-12">
                      <div className="row justify-content-end proceed-row">
                        <div className="col">
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
                        <div className="col">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              handleSubmit();
                              if (isValid) {
                                setFirstModalOpen(false);
                                setSecondModalOpen(true);
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
        <></>
      )}
      {secondModalOpen ? (
        <>
          {/* <p>Add USDT</p>
          <div className="col-12">
            <div className="form-group">
              <label>
                Amount in INR<span className="red">*</span>
              </label>
              <div className="quantity-row">
                <input
                  type="text"
                  className="form-control react-form-input pluminusinput"
                  id="inr_amount"
                  value={values.inr_amount}
                  placeholder="Amount in INR"
                  onChange={e => {
                    console.log(e.target.value, "checkevalue", values);
                    if (e) {
                      setValues({ ...values, inr_amount: e.target.value });
                    }
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
          <div className="col-12">
            <p>
              Summary valid for :{" "}
              <span className="text-bold">{countdown} Sec</span>
            </p>
            <p>You Get :{onmetaFeatchData.receivedTokens}</p>
            <p>
              1 {currencyDetails?.name} : {onmetaFeatchData.conversionRate}
            </p>
            <p>Transaction Fee : {onmetaFeatchData.transactionFee}</p>
          </div>
          <div className="col-12 mb-3">
            <div className="row justify-content-end">
              <div className="col">
                <button
                  onClick={e => {
                    e.preventDefault();
                    createUserOrder();
                  }}
                  type="submit"
                  className="btn btn-blue w-100"
                  disabled={
                    values.minimum_value < onmetaFeatchData.receivedTokens
                      ? false
                      : true
                  }
                >
                  Proceed
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => {
                    setSecondModalOpen(false);
                    setFirstModalOpen(true);
                  }}
                  className="btn form-button modalcancelbutton"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div> */}
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-5">
              <div className="secure-admin-box mb-5 mb-sm-0">
                <h2 class="secure-box-title justify-content-between">
                  Add USDT
                </h2>
                <div className="secure-box-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label>
                          Amount in INR<span className="red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          id="inr_amount"
                          value={values.inr_amount}
                          placeholder="Package Amount"
                          onChange={e => {
                            // console.log(e.target.value, "checkevalue", values);
                            if (e) {
                              setOnmetaFeatchData({
                                transactionFee: 0,
                                receivedTokens: 0,
                                conversionRate: 0,
                                transactionFeeCurrency: ""
                              });
                              setValues({
                                ...values,
                                inr_amount: e.target.value
                              });
                            }
                          }}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="min-total-row">
                        <span className="min-total-value">
                          Summary valid for : <span>{countdown} Sec</span>
                        </span>
                        <span className="min-total-value">
                          You Get :{" "}
                          <span>{onmetaFeatchData.receivedTokens}</span>
                        </span>
                        <span className="min-total-value">
                          1 {currencyDetails?.name} :{" "}
                          <span>{onmetaFeatchData.conversionRate}</span>
                        </span>
                        <span className="min-total-value">
                          Transaction Fee :{" "}
                          <span className="text-uppercase">
                            {onmetaFeatchData.transactionFee
                              ? onmetaFeatchData.transactionFee
                              : ""}{" "}
                            {onmetaFeatchData.transactionFeeCurrency
                              ? onmetaFeatchData.transactionFeeCurrency
                              : ""}
                          </span>
                        </span>
                        {/* <span className="min-total-value">
                          Gatway Fee : <span> 100 INR </span>
                        </span> */}
                        <span className="min-total-value">
                          Minimum amount: <span> 10000 INR </span>
                        </span>
                      </div>
                    </div>
                    <div className="col-12 mb-2">
                      <div className="package-radio-row">
                        {console.log(paymentmethods, "check753")}
                        {paymentmethods.length > 0 &&
                          paymentmethods?.map(val => {
                            return (
                              <div className="package-radio-box">
                                <input
                                  type="radio"
                                  checked={selectedPaymentMethod === val.code}
                                  value={val.code}
                                  name="pm"
                                  onChange={e => {
                                    setSelectedPaymentMethod(e.target.value);
                                    if (e.target.value !== "INR_UPI") {
                                      setBankDetails(val.extra);
                                    }
                                  }}
                                  id={val.code}
                                />
                                <label for={val.code}>
                                  <img src={val.imageUrl} alt={val.code} />
                                </label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="row justify-content-end proceed-row">
                        <div className="col">
                          <button
                            onClick={() => {
                              setSecondModalOpen(false);
                              setFirstModalOpen(true);
                            }}
                            className="btn form-button modalcancelbutton"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              setSubmitDisabled(true);
                              createUserOrder();
                            }}
                            type="submit"
                            className="btn btn-blue w-100 mt-2 mt-sm-0"
                            // disabled={isValid ? false : true}
                            disabled={
                              onmetaFeatchData.receivedTokens <
                                values.minimum_value ||
                              isSubmitDisabled ||
                              (values.inr_amount
                                ? values.inr_amount <= 9999.999999999
                                : true)
                            }
                          >
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {thirdModalOpen ? (
        <>
          {/* {qrValue && (
            <div style={{ maxWidth: "250px" }}>
              <QRCode
                value={qrValue}
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
          )}
          <div className="col-12">
            <div className="form-group">
              <label>
                UTR<span className="red">*</span>
              </label>
              <div className="quantity-row">
                <input
                  type="text"
                  className="form-control react-form-input pluminusinput"
                  id="utr_value"
                  value={values.utr_value}
                  placeholder="UTR"
                  onChange={e => {
                    console.log(e.target.value, "checkevalue", values);
                    if (e) {
                      setValues({ ...values, utr_value: e.target.value });
                    }
                  }}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row justify-content-end">
              <div className="col">
                <button
                  onClick={e => {
                    e.preventDefault();
                    updateUserOrderUtr();
                  }}
                  type="submit"
                  className="btn btn-blue w-100"
                  disabled={values.utr_value ? false : true}
                >
                  Proceed
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => {
                    history.goBack();
                  }}
                  className="btn form-button modalcancelbutton"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div> */}
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-5">
              <div className="secure-admin-box mb-5 mb-sm-0">
                <h2 class="secure-box-title justify-content-between">
                  {qrValue ? "Scan & Pay" : "Bank Details"}
                </h2>
                <div className="secure-box-body">
                  {qrValue && (
                    <div style={{ maxWidth: "200px", margin: "auto" }}>
                      <QRCode
                        value={qrValue}
                        size={256}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%"
                        }}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                  )}
                  {bankDetails && (
                    <div>
                      {
                        <>
                          <p>Account Name : {bankDetails.name},</p>
                          <p>Account ifsc : {bankDetails.ifsc},</p>
                          <p>Account No : {bankDetails.account},</p>
                        </>
                      }
                    </div>
                  )}
                  <div className="row mt-2">
                    <div className="col-12">
                      <div className="form-group secure-form-group">
                        <label>
                          UTR (Payment transaction id)
                          <span className="red">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          id="utr_value"
                          value={values.utr_value}
                          placeholder="UTR (payment transaction id)"
                          onChange={e => {
                            // console.log(e.target.value, "checkevalue", values);
                            if (e) {
                              setValues({
                                ...values,
                                utr_value: e.target.value
                              });
                            }
                          }}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row justify-content-end proceed-row">
                        <div className="col">
                          <button
                            onClick={() => {
                              history.goBack();
                              setQrValue("");
                              setBankDetails(null);
                            }}
                            className="btn form-button modalcancelbutton"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col">
                          <button
                            onClick={e => {
                              e.preventDefault();
                              setisProceedThreeDisabled(true);
                              updateUserOrderUtr();
                            }}
                            type="submit"
                            className="btn btn-blue w-100 mt-2 mt-sm-0"
                            disabled={isProceedThreeDisabled}
                          >
                            Proceed
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {fourthModalOpen ? (
        <>
          <div className="col-12">
            <div className="row justify-content-end">
              <div className="col">
                <button
                  onClick={e => {
                    setSubmitDisabled(true);
                    e.preventDefault();
                    updateUserOrderUtr();
                  }}
                  type="submit"
                  className="btn btn-blue w-100"
                  // disabled={isValid ? false : true}
                >
                  Proceed
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => {
                    history.goBack();
                  }}
                  className="btn form-button modalcancelbutton"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {loading ? <Loader /> : ""}
    </>
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
  connect(mapStateToProps, { success, error })
)(Paymentpage);
