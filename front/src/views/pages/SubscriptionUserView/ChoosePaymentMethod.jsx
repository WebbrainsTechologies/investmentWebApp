import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  useParams,
  withRouter
} from "react-router-dom/cjs/react-router-dom.min";
import { compose } from "redux";
import { getSubscriptionDetailById } from "services/subscriptionServices";
import navigationAction from "redux/navigation/actions";
import { Button } from "reactstrap";
import pdf_file from "../../../assets/termsandconditions/GTC-SF.pdf";

const { success, error, fetching } = navigationAction;

function ChoosePaymentMethod(props) {
  const { token, user } = props;
  const [subscriptionData, setSubscriptionData] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [TNCTether, setTNCTether] = useState(false);
  const [TNCAvailableCash, setTNCAvailableCash] = useState(false);
  const [TNCOnmeta, setTNCOnmeta] = useState(false);

  let { id } = useParams();
  // console.log("id", id);

  const getSubscriptionData = async () => {
    await getSubscriptionDetailById(token, id).then(res => {
      if (res.success) {
        // console.log("res", res);
        // console.log(res.data);
        success(res.message);
        setSubscriptionData(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getSubscriptionData();
  }, [id]);

  return (
    <div>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-5">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <div className="secure-box-body">
                <div className="min-total-row flex-column">
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
                  {subscriptionData.description ? (
                    <span class="min-total-value min-total-value-between">
                      Description:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: subscriptionData.description
                        }}
                      ></span>
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="package-radio-row">
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
                    <label for="onmeta"> Buy</label>
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
                        disabled={TNCTether === true ? false : true}
                        onClick={() => {
                          props.history.push(
                            `/manuallpaymentpage/${subscriptionData._id}`
                          );
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
                        disabled={TNCOnmeta === true ? false : true}
                        onClick={() => {
                          props.history.push(
                            `/paymentPage/${subscriptionData._id}`
                          );
                        }}
                      >
                        Purchase
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
                        Purchase
                      </Button>
                    </div>
                  </div>
                ) : null}
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
)(ChoosePaymentMethod);
