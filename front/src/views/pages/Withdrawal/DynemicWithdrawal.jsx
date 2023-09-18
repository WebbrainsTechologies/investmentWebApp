import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/DynemicwithdrawalEnhancer";
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
  offRampCreateOrder,
  offRampFatchQuatation,
  offRampFeatchOrderStatus,
  offRampUpdateHash,
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
import {
  addUserWithdrawalRequest,
  changeWithdrawalRequestStatus,
  checkpendingwithdrawal
} from "services/withdrawalServices";
import { addonmetaLogs } from "services/onmetaLogsServices";

const { success, error } = NavigationActions;
const DynemicWithdrawal = props => {
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
    history,
    walletAmount
  } = props;
  let debounceTimer;
  const { id } = useParams();
  // const queryParams = new URLSearchParams(window.location.search);
  // const walletAmount = queryParams.get("walletAmount");
  // console.log(id, "chcekbothparams", walletAmount);
  const [loading, setLoading] = useState(false);
  const [inputName, setInputName] = useState("");
  // const [timeoutstate, setTimeoutState] = useState(false);
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [subscriptionMinimumAmount, setSubscriptionMinimumAmount] = useState(
    ""
  );
  const [hashbtndisable, setHashbtndisable] = useState(false);
  const [localSubscriptionId, setLocalSubscriptionId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [disabledbtn, setDisableBtn] = useState(false);
  //   const [firstModalOpen, setFirstModalOpen] = useState(true);
  const [secondModalOpen, setSecondModalOpen] = useState(true);
  const [thirdModalOpen, setThirdModalOpen] = useState(false);
  const [fourthModalOpen, setFourthModalOpen] = useState(false);
  const [countStart, setCountStart] = useState(false);
  //   const [currencyId, setCurrencyId] = useState("");
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [onmetaFeatchData, setOnmetaFeatchData] = useState({
    receivedINR: 0,
    transactionFee: 0,
    conversionRate: 0
  });
  const [countdown, setCountdown] = useState(30);
  const [qrValue, setQrValue] = useState("");
  const [stopFatchQuatation, setStopFetchQuatation] = useState(true);
  const [bankDetails, setBankDetails] = useState({});
  // console.log(user.email, "check74");
  const getUserAccessTokenFromOnMeta = async () => {
    await onMetaUserLogin({
      email: user?.email
    }).then(res => {
      if (res?.success) {
        setUseracessTokenByOnMeta(res.data?.accessToken);
        setBankDetails(res?.data?.bankDetails);
      } else {
        error(res.message);
      }
    });
  };
  // console.log(useracessTokenByOnMeta, "check53");
  useEffect(() => {
    user?.email && getUserAccessTokenFromOnMeta();
  }, []);

  //   const getSubscriptionById = async () => {
  //     await getSubscriptionDetailById(token, id).then((res) => {
  //       if (res.success) {
  //         setValues({
  //           ...res.data,
  //           quantity: 1,
  //           terms_condition: false,
  //           other_terms_condition: false,
  //         });
  //         setSubscriptionAmount(res.data?.amount);
  //         setSubscriptionMinimumAmount(res.data?.minimum_value);
  //         setCurrencyId(res.data?.currencyId);
  //       } else {
  //         error(res.message);
  //       }
  //     });
  //   };
  //   useEffect(() => {
  //     getSubscriptionById();
  //   }, []);

  const getCurrencyDetails = async () => {
    await getCurrencyById(token, id).then(res => {
      // console.log(res, "check83");
      if (res.success) {
        setCurrencyDetails(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    id && getCurrencyDetails();
  }, [id]);

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
      // setTimeoutState(true);
    }
  }, [countdown]);

  // console.log(currencyDetails, "check101");
  const createUserOrder = async () => {
    await checkpendingwithdrawal(token, {
      currencyId: currencyDetails?._id,
      amount: values.amount,
      walletAmount: walletAmount
    }).then(async res => {
      if (res.success) {
        let data = {
          sellTokenSymbol: currencyDetails.symbol,
          sellTokenAddress: currencyDetails.address,
          chainId: currencyDetails.chainId,
          fiatCurrency: "inr",
          sellTokenAmount: Number(values.amount),
          senderWalletAddress: process.env.REACT_APP_ONMETA_SENDER_ADDRESS,
          // fiatAmount: 100,
          // fiatAmount:
          //   Number(values?.amount) > 100 ? Number(values?.amount) - 100 : 0,
          bankDetails: {
            accountNumber: bankDetails?.accountNumber,
            ifsc: bankDetails?.ifsc
          }
        };
        await offRampCreateOrder(useracessTokenByOnMeta, data).then(
          async res => {
            // console.log(res, "check141", values);
            let logdata = {
              url: `${
                process.env.REACT_APP_ONMETA_URI
                  ? process.env.REACT_APP_ONMETA_URI
                  : ""
              }/offramp/orders/create`,
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
              setOrderId(res?.data?.orderId);
              // setQrValue(res?.data?.redirect_actions?.qr_checkout_string);
              setCountdown(30);
              setCountStart(false);
              setStopFetchQuatation(false);
              await addUserWithdrawalRequest(token, {
                amount: Number(res.data?.quote),
                senderWalletAddress:
                  process.env.REACT_APP_ONMETA_SENDER_ADDRESS,
                inr_amount: onmetaFeatchData.receivedINR,
                withdrawal_type: "with_one_meta",
                withdrawal_orderId: res.data.orderId,
                currencyId: id,
                walletAmount: walletAmount
              }).then(res => {
                // console.log(res.data, "chckdata167");
                if (res.success) {
                  success(res.message);
                  setSecondModalOpen(false);
                  setThirdModalOpen(true);
                  setLocalSubscriptionId(res.data?._id);
                  setDisableBtn(false);
                } else {
                  error(res.message);
                  setDisableBtn(false);
                }
              });
            } else {
              // console.log(res, "checkerror154");
              error(res.error.message);
              setDisableBtn(false);
            }
          }
        );
      } else {
        error(res.message);
        setDisableBtn(false);
      }
    });
  };

  const getFatchQuotationData = async () => {
    let data = {
      sellTokenSymbol: currencyDetails.symbol,
      sellTokenAddress: currencyDetails.address,
      chainId: currencyDetails.chainId,
      fiatCurrency: "inr",
      sellTokenAmount: Number(values?.amount),
      senderAddress: process.env.REACT_APP_ONMETA_SENDER_ADDRESS
    };
    await offRampFatchQuatation(useracessTokenByOnMeta, data).then(res => {
      // console.log(res, "check128");
      if (res?.success) {
        setCountStart(true);
        setOnmetaFeatchData({
          // receivedTokens: res?.data.sellTokens ? res?.data.sellTokens : 0,
          receivedINR: res?.data.fiatAmount ? res?.data.fiatAmount : 0,
          transactionFee: (
            (res?.data?.gasFee ? res?.data?.gasFee : 0) +
            (res?.data?.tdsFee ? res?.data?.tdsFee : 0)
          ).toFixed(4),
          conversionRate: res?.data.conversionRate
            ? res?.data.conversionRate
            : 0
        });
        setCountdown(30);
        setStopFetchQuatation(true);
      } else {
        setOnmetaFeatchData({
          receivedINR: 0,
          transactionFee: 0,
          conversionRate: 0
        });
      }
    });
  };
  // console.log(values.amount, "check133");
  useEffect(() => {
    const timeout = setInterval(() => {
      secondModalOpen && values?.amount && getFatchQuotationData();
    }, 30000);
    return () => clearTimeout(timeout);
  }, [values.amount, secondModalOpen]);

  // useEffect(() => {
  //   values.amount && getFatchQuotationData();
  // }, [values.amount]);

  // useEffect(() => {
  //   if (debounceTimer) {
  //     clearTimeout(debounceTimer);
  //     debounceTimer = null;
  //   }
  //   debounceTimer = setTimeout(() => {
  //     values.amount && getFatchQuotationData();
  //   }, 2000);
  // }, [values.amount]);

  useEffect(() => {
    if (values.amount) {
      const timeOutId = setTimeout(() => {
        setCountdown(30);
        setStopFetchQuatation(false);
        getFatchQuotationData();
      }, 1000);
      return () => clearTimeout(timeOutId);
    }
    //eslint-disable-next-line
  }, [values.amount]);

  const updateUserOrderUtr = async () => {
    let data = {
      orderId: orderId,
      txnHash: values.hash_value
    };
    await offRampUpdateHash(useracessTokenByOnMeta, data).then(async res => {
      // console.log(res, "check124");
      let logdata = {
        url: `${
          process.env.REACT_APP_ONMETA_URI
            ? process.env.REACT_APP_ONMETA_URI
            : ""
        }/offramp/orders/txnhash`,
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
        await offRampFeatchOrderStatus(useracessTokenByOnMeta, {
          orderId: data.orderId
        }).then(async res => {
          // console.log(res, "check239");
          let logdata = {
            url: `${
              process.env.REACT_APP_ONMETA_URI
                ? process.env.REACT_APP_ONMETA_URI
                : ""
            }/offramp/orders/status`,
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
          if (res?.success) {
            if (
              !(
                res.data?.status === "pending" ||
                res.data?.status === "InProgress"
              )
            ) {
              await changeWithdrawalRequestStatus(token, localSubscriptionId, {
                status:
                  res.data?.status === "refunded" ? "Rejected" : "Accepted",
                userId: user._id,
                hash_value: values.hash_value
              }).then(res => {
                if (res.success) {
                  success(res.message);
                  setHashbtndisable(false);
                } else {
                  error(res.message);
                  setHashbtndisable(false);
                }
              });
            }
          } else {
            error(res?.error?.message);
            setHashbtndisable(false);
          }
          history.push("/packages");
        });
      } else {
        error(res?.error?.message ? res?.error?.message : res?.message);
        setHashbtndisable(false);
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
      {/* {firstModalOpen ? (
        <form>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
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
              <div className="form-group">
                <label>
                  Quantity <span className="red">*</span>
                </label>
                <div className="quantity-row">
                  <button
                    className="plusminusbtn"
                    onClick={(e) => {
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
                            : 1),
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
                    onChange={(e) => {
                      setValues({
                        ...values,
                        quantity: e.target.value,
                        amount:
                          Number(subscriptionAmount) * Number(e.target.value),
                      });
                    }}
                    onBlur={handleBlur}
                  />
                  <button
                    className="plusminusbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(values, "checkvalues139");
                      setValues({
                        ...values,
                        quantity: Number(values.quantity) + 1,
                        amount:
                          Number(subscriptionAmount) *
                          (Number(values.quantity) + 1),
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
              <span>Minimum buy value {Number(values.minimum_value)}</span>
            </div>
            <div className="col-12 mb-2">
              Total value : {Number(values.amount)}
              <div>
                <Error field="amount" />
              </div>
            </div>
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                  checked={values.terms_condition}
                  onChange={(e) => {
                    setValues({ ...values, terms_condition: e.target.checked });
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
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck2"
                  checked={values.other_terms_condition}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      other_terms_condition: e.target.checked,
                    });
                  }}
                  onBlur={handleBlur}
                />
                <label
                  className="form-check-label register-privacy-text"
                  htmlFor="exampleCheck2"
                  style={{ textAlign: "justify" }}
                >
                  By ticking the box, I am aware that Company Provide 75%
                  withdrawal of My principle amount. And the execution of the
                  Company contract before the expiry of the revocation period
                  and confirm my knowledge that by this consent I lose my
                  execution of the Company contract.
                </label>
              </div>
              <Error field="other_terms_condition" />
            </div>
            <div className="col-12 mb-2"></div>
            <div className="col-12">
              <div className="row justify-content-end">
                <div className="col">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                      if (isValid) {
                        setFirstModalOpen(false);
                        setSecondModalOpen(true);
                      }
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
                    onClick={(e) => {
                      e.preventDefault();
                      // console.log(history, "checkhistory");
                      history.goBack();
                    }}
                    className="btn form-button modalcancelbutton"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <></>
      )} */}
      {secondModalOpen ? (
        // <>
        //   <p>Add USDT</p>
        //   <div className="col-12">
        //     <div className="form-group">
        //       <label>
        //         Amount in INR<span className="red">*</span>
        //       </label>
        //       <div className="quantity-row">
        //         <input
        //           type="text"
        //           className="form-control react-form-input pluminusinput"
        //           id="amount"
        //           value={values.amount}
        //           placeholder="Amount in INR"
        //           onChange={e => {
        //             console.log(e.target.value, "checkevalue", values);
        //             if (e) {
        //               setValues({ ...values, amount: e.target.value });
        //             }
        //           }}
        //           onBlur={handleBlur}
        //         />
        //       </div>
        //     </div>
        //   </div>
        //   <div className="col-12">
        //     <p>
        //       Summary valid for :{" "}
        //       <span className="text-bold">{countdown} Sec</span>
        //     </p>
        //     <p>You Get :{onmetaFeatchData.receivedTokens}</p>
        //     <p>
        //       1 {currencyDetails?.name} : {onmetaFeatchData.conversionRate}
        //     </p>
        //     <p>Transaction Fee : {onmetaFeatchData.transactionFee}</p>
        //   </div>
        //   <div className="col-12 mb-3">
        //     <div className="row justify-content-end">
        //       <div className="col">
        //         <button
        //           onClick={e => {
        //             e.preventDefault();
        //             createUserOrder();
        //           }}
        //           type="submit"
        //           className="btn btn-blue w-100"
        //           disabled={
        //             Number(onmetaFeatchData.receivedTokens) === 0
        //               ? true
        //               : !(
        //                   Number(onmetaFeatchData.receivedTokens) <
        //                   Number(walletAmount)
        //                 )
        //           }
        //         >
        //           Proceed
        //         </button>
        //       </div>
        //       <div className="col">
        //         <button
        //           onClick={() => {
        //             // setSecondModalOpen(false);
        //             // setFirstModalOpen(true);
        //             history.goBack();
        //           }}
        //           className="btn form-button modalcancelbutton"
        //         >
        //           Cancel
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-5">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <h2 class="secure-box-title justify-content-between">
                Withdraw USDT
              </h2>
              <div className="secure-box-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>
                        Amount<span className="red">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="amount"
                        value={values.amount}
                        placeholder="Crypto Amount"
                        onChange={e => {
                          // console.log(e.target.value, "checkevalue", values);
                          setOnmetaFeatchData({
                            receivedINR: 0,
                            transactionFee: 0,
                            conversionRate: 0
                          });
                          if (e) {
                            setValues({
                              ...values,
                              amount: e.target.value
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
                        <span>{onmetaFeatchData.receivedINR} INR</span>
                      </span>
                      <span className="min-total-value">
                        1 {currencyDetails?.name} :{" "}
                        <span>{onmetaFeatchData.conversionRate}</span>
                      </span>
                      <span className="min-total-value">
                        Transaction Fee :{" "}
                        <span>{onmetaFeatchData.transactionFee}</span>
                      </span>
                      <span className="min-total-value">
                        Available Balance : <span>{walletAmount}</span>
                      </span>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <div className="row justify-content-end">
                      <div className="col">
                        <button
                          onClick={() => {
                            // setSecondModalOpen(false);
                            // setFirstModalOpen(true);
                            history.goBack();
                          }}
                          className="btn form-button modalcancelbutton"
                        >
                          Cancel
                        </button>
                      </div>
                      {/* {console.log(
                        values.amount && onmetaFeatchData?.receivedINR !== 0,
                        "check723"
                      )} */}
                      <div className="col">
                        <button
                          onClick={e => {
                            e.preventDefault();
                            setDisableBtn(true);
                            createUserOrder();
                          }}
                          type="submit"
                          className="btn btn-blue w-100"
                          // disabled={
                          //   Number(onmetaFeatchData.receivedINR) === 0
                          //     ? true
                          //     : !(
                          //         Number(onmetaFeatchData.receivedINR) <
                          //         Number(walletAmount)
                          //       )
                          // }
                          disabled={
                            values.amount && onmetaFeatchData?.receivedINR !== 0
                              ? Number(values.amount) >=
                                Number(walletAmount) + 0.1
                                ? true
                                : disabledbtn === true
                                ? true
                                : false
                              : true
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
      ) : (
        <></>
      )}
      {thirdModalOpen ? (
        <>
          {qrValue && (
            <div style={{ maxWidth: "250px" }}>
              s
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
                Hash<span className="red">*</span>
              </label>
              <div className="quantity-row">
                <input
                  type="text"
                  className="form-control react-form-input pluminusinput"
                  id="hash_value"
                  value={values.hash_value}
                  placeholder="Hash"
                  onChange={e => {
                    // console.log(e.target.value, "checkevalue", values);
                    if (e) {
                      setValues({ ...values, hash_value: e.target.value });
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
                    setHashbtndisable(true);
                    updateUserOrderUtr();
                  }}
                  type="submit"
                  className="btn btn-blue w-100"
                  disabled={
                    values.hash_value ? (hashbtndisable ? true : false) : true
                  }
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
      {fourthModalOpen ? (
        <>
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
                  // disabled={isValid ? false : true}
                >
                  Proceed
                </button>
              </div>
              <div className="col">
                <button
                  onClick={() => {
                    setFourthModalOpen(false);
                    setThirdModalOpen(true);
                    // history.goBack();
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
  // console.log(state, "check793");
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    walletAmount: state.navigation.walletValue
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error })
)(DynemicWithdrawal);
