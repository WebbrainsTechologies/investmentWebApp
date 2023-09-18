import React, { useState } from "react";
import { connect } from "react-redux";
import {
  useParams,
  withRouter
} from "react-router-dom/cjs/react-router-dom.min";
import { compose } from "redux";
import navigationAction from "redux/navigation/actions";
import { Button, Modal } from "reactstrap";
import pdf_file from "../../../assets/termsandconditions/GTC-SF.pdf";
import AddOtpModal from "../authentication/AddOtpModal";
import { sendOtp } from "services/userProfileServices";
import Loader from "components/Loader";

const { success, error, fetching } = navigationAction;

function ChooseWithdrawalMethod(props) {
  const { token, user, walletAmount } = props;
  const [subscriptionData, setSubscriptionData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [TNCTether, setTNCTether] = useState(false);
  const [TNCAvailableCash, setTNCAvailableCash] = useState(false);
  const [TNCOnmeta, setTNCOnmeta] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [withdrawalType, setWihdrawalType] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  let { id } = useParams();

  const handleSendOtp = async e => {
    e.preventDefault();
    // if (kycStatus) {
    setloading(true);
    await sendOtp({ email: user?.email }).then(res => {
      if (res.success) {
        success(res.message);
        setloading(false);
        setIsOpen(true);
      } else {
        error(res.message);
        setloading(false);
      }
    });
    // } else {
    //   error("Please Verify your kyc.");
    // }
  };
  // const queryParams = new URLSearchParams(window.location.search);
  // const walletAmount = queryParams.get("walletAmount");
  return (
    // <div className="container-fluid">
    //   <div className="d-flex flex-column justify-content-end align-items-center m-3">
    //     <div className="row">
    //       <div className="col-12 payment-options">
    //         <input
    //           type="radio"
    //           value="tether"
    //           name="pm"
    //           onChange={e => {
    //             console.log(e.target.value, "1");
    //             setSelectedOption(e.target.value);
    //           }}
    //         />
    //         <span> Tether (USDT)</span>

    //         {selectedOption === "tether" ? (
    //           <div>
    //             <input
    //               type="checkbox"
    //               className="tnc_checkbox m-2"
    //               onChange={e => {
    //                 setTNCTether(e.target.checked);
    //               }}
    //               value={TNCTether}
    //             />
    //             <span className="mr-2">
    //               By clicking this the box,I declare that i have read the{" "}
    //               <a href="#">Common Terms and Conditions</a> and i acccept both
    //               as a integral part of contract{" "}
    //             </span>
    //             <Button
    //               color="primary"
    //               className="purchase_button m-2"
    //               disabled={TNCTether === true ? false : true}
    //               onClick={() => {
    //                 props.history.push(
    //                   `/manual-withdrawal/${id}?walletAmount=${walletAmount}`
    //                 );
    //               }}
    //             >
    //               Purchase
    //             </Button>
    //           </div>
    //         ) : null}
    //       </div>
    //     </div>
    //   </div>

    //   <div className="d-flex flex-column justify-content-end align-items-center m-3">
    //     <div className="row">
    //       <div className="col-12 payment-options">
    //         <input
    //           type="radio"
    //           value="onmeta"
    //           name="pm"
    //           onChange={e => {
    //             setSelectedOption(e.target.value);
    //           }}
    //         />
    //         <span> Onmeta</span>
    //         {selectedOption === "onmeta" ? (
    //           <div>
    //             <input
    //               type="checkbox"
    //               className="tnc_checkbox m-2"
    //               value={TNCOnmeta}
    //               onChange={e => setTNCOnmeta(e.target.checked)}
    //             />
    //             <span className="mr-2">
    //               By clicking this the box,I declare that i have read the{" "}
    //               <a href="#">Common Terms and Conditions</a> and i acccept both
    //               as a integral part of contract{" "}
    //             </span>
    //             <Button
    //               color="primary"
    //               className="purchase_button m-2"
    //               disabled={TNCOnmeta === true ? false : true}
    //               onClick={() => {
    //                 props.history.push(
    //                   `/withdrawalscreen/${id}/?walletAmount=${walletAmount}`
    //                 );
    //               }}
    //             >
    //               Purchase
    //             </Button>
    //           </div>
    //         ) : null}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="d-flex flex-column justify-content-end align-items-center m-3">
    //     <div className="row">
    //       <div className="col-12 payment-options">
    //         <input
    //           type="radio"
    //           value="available-cash"
    //           name="pm"
    //           disabled={true}
    //           onChange={e => {
    //             setSelectedOption(e.target.value);
    //           }}
    //         />
    //         <span> Available Balance (Cash)</span>
    //         {selectedOption === "available-cash" ? (
    //           <div className="">
    //             <input
    //               type="checkbox"
    //               className="tnc_checkbox m-2"
    //               value={TNCAvailableCash}
    //               onChange={e => setTNCAvailableCash(e.target.checked)}
    //             />
    //             <span className="mr-2">
    //               By clicking this the box,I declare that i have read the{" "}
    //               <a href="#">Common Terms and Conditions</a> and i acccept both
    //               as a integral part of contract{" "}
    //             </span>
    //             <Button
    //               color="primary"
    //               className="purchase_button m-2"
    //               disabled={TNCAvailableCash === true ? false : true}
    //               onClick={() => {
    //                 props.history.push(
    //                   `/manuallpaymentpage/${subscriptionData._id}`
    //                 );
    //               }}
    //             >
    //               Purchase
    //             </Button>
    //           </div>
    //         ) : null}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-5">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <div className="secure-box-body">
                <div className="package-radio-row mt-0">
                  <div className="package-radio-box">
                    <input
                      type="radio"
                      value="tether"
                      name="pm"
                      onChange={e => {
                        // console.log(e.target.value, "1");
                        setSelectedOption(e.target.value);
                      }}
                      id="tether"
                    />
                    <label for="tether"> Manual Transfer</label>
                  </div>
                  <div className="package-radio-box">
                    <input
                      type="radio"
                      value="onmeta"
                      name="pm"
                      onChange={e => {
                        setSelectedOption(e.target.value);
                      }}
                      id="onmeta"
                    />
                    <label for="onmeta">INR withdrawal</label>
                  </div>
                  {/* <div className="package-radio-box">
                    <input
                      type="radio"
                      value="available-cash"
                      name="pm"
                      disabled={true}
                      onChange={e => {
                        setSelectedOption(e.target.value);
                      }}
                      id="available-cash"
                    />
                    <label for="available-cash"> Upgrade Ultima</label>
                  </div> */}
                </div>
                {selectedOption === "tether" ? (
                  <div className="package-radio-detail-box">
                    <div className="package-radio-detail-text">
                      <input
                        type="checkbox"
                        className="tnc_checkbox"
                        onChange={e => {
                          setTNCTether(e.target.checked);
                        }}
                        id="tether-agree"
                        value={TNCTether}
                      />
                      <label for="tether-agree">
                        By clicking this the box,I declare that i have read the{" "}
                        <a href={pdf_file} target="_blank" rel="noreferrer">
                          Common Terms and Conditions
                        </a>{" "}
                        and i acccept both as a integral part of contract{" "}
                      </label>
                      <Button
                        className="btn btn-blue"
                        disabled={TNCTether === true ? disableBtn : true}
                        onClick={e => {
                          // props.history.push(`/manual-withdrawal/${id}`);
                          setDisableBtn(true);
                          setWihdrawalType("manual");
                          handleSendOtp(e);
                        }}
                      >
                        Manual Transfer
                      </Button>
                    </div>
                  </div>
                ) : null}

                {selectedOption === "onmeta" ? (
                  <div className="package-radio-detail-box">
                    <div className="package-radio-detail-text">
                      <input
                        type="checkbox"
                        className="tnc_checkbox"
                        value={TNCOnmeta}
                        id="onmeta-text"
                        onChange={e => setTNCOnmeta(e.target.checked)}
                      />
                      <label for="onmeta-text">
                        By clicking this the box,I declare that i have read the{" "}
                        <a href={pdf_file} target="_blank" rel="noreferrer">
                          Common Terms and Conditions
                        </a>{" "}
                        and i acccept both as a integral part of contract{" "}
                      </label>
                      <Button
                        className="btn btn-blue"
                        disabled={TNCOnmeta === true ? disableBtn : true}
                        onClick={e => {
                          // props.history.push(`/withdrawalscreen/${id}`);
                          // if (user?.is_bank_verified) {
                          //   props.history.push(`/choosebankaccount/${id}`);
                          // } else {
                          //   props.history.push(`/linkbankaccount?id=${id}`);
                          // }
                          setDisableBtn(true);
                          setWihdrawalType("withonmeta");
                          handleSendOtp(e);
                        }}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                ) : null}

                {selectedOption === "available-cash" ? (
                  <div className="package-radio-detail-box">
                    <div className="package-radio-detail-text">
                      <input
                        type="checkbox"
                        className="tnc_checkbox"
                        value={TNCAvailableCash}
                        id="available-cash-text"
                        onChange={e => setTNCAvailableCash(e.target.checked)}
                      />
                      <label for="available-cash-text">
                        By clicking this the box,I declare that i have read the{" "}
                        <a href={pdf_file} target="_blank" rel="noreferrer">
                          Common Terms and Conditions
                        </a>{" "}
                        and i acccept both as a integral part of contract{" "}
                      </label>
                      <Button
                        className="btn btn-blue"
                        disabled={TNCAvailableCash === true ? false : true}
                        onClick={() => {
                          props.history.push(
                            `/manuallpaymentpage/${subscriptionData._id}`
                          );
                        }}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {loading ? <Loader /> : <></>}
      </div>
      <Modal isOpen={isOpen} backdrop={true} centered>
        <AddOtpModal
          onClose={() => {
            setIsOpen(false);
          }}
          email={user?.email}
          path="Withdrawal"
          selectedCurrency={id}
          withdrawalType={withdrawalType}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = state => {
  // console.log(state, "check312");
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    walletAmount: state.navigation.walletValue
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching })
)(ChooseWithdrawalMethod);
