import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { getallSubscription } from "services/subscriptionServices";
import { addUserSubscription } from "services/userSubscriptionServices";
import { getallCurrency } from "services/currencyServices";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  User
} from "react-feather";
import SubscriptionPlanAmountEdit from "views/pages/SubscriptionUserView/SubscriptionPlanAmountEdit";
import { Modal } from "reactstrap";
import Approvesubscriptionrow from "views/app/dashboards/Approvesubscriptionrow";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import {
  getUserDetailInvestmentData,
  getUserDetailRoiAndCommision,
  getUserDetailTotalAsset,
  getUserDetailWalletData,
  getUserDetailWithdrawalData,
  getallUserApprovedSubscriptionWithoutpaginationByUserId,
  viewUserByID
} from "services/userDetailServices";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import moment from "moment";

const { success, error, fetching } = NavigationActions;

const UserDetails = props => {
  const queryParams = new URLSearchParams(window.location.search);
  const userDetails = queryParams.get("userDetails");
  // console.log(userDetails, "check40");
  const { id } = useParams();
  const { token, success, error, history } = props;
  const [monthGain, setMonthGain] = useState("");
  const [userTotalInvestment, setUserTotalInvestment] = useState("");
  const [userTotalAsset, setUserTotalAsset] = useState("");
  const [withdrawn, setWithdrawn] = useState("");
  const [commision, setcommision] = useState("");
  const [roi, setroi] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [approvedSubscription, setApprovedSubscription] = useState([]);
  const [loader, setloader] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [userpersonaldetails, setuserpersonaldetails] = useState({});

  const getCurrencyList = async () => {
    await getallCurrency(token).then(res => {
      // console.log(res.data, "check59");
      if (res.success) {
        if (res.data?.length > 0) {
          setSubscriptionData(
            res.data?.map(val => {
              // console.log(val, "checkvale");
              return {
                label: val.name,
                value: val._id
              };
            })
          );
          setSelectedSubscription(res.data[0]?._id);
        }
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getCurrencyList();
  }, []);

  const UserPersonalDetails = async () => {
    await viewUserByID(token, id).then(res => {
      if (res.success) {
        setuserpersonaldetails(res.data);
      } else {
        error(res.message);
      }
    });
  };

  useEffect(() => {
    id && UserPersonalDetails();
  }, []);

  const getUserInvestmentData = async () => {
    setloader(true);
    await getUserDetailInvestmentData(token, selectedSubscription, {
      userId: id
    }).then(res => {
      if (res.success) {
        setUserTotalInvestment(res.data?.userTotalInvestment);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getUserInvestmentData();
  }, [selectedSubscription]);

  const getUserTotalAsset = async () => {
    setloader(true);
    await getUserDetailTotalAsset(token, selectedSubscription, {
      userId: id
    }).then(res => {
      if (res.success) {
        setUserTotalAsset(res.data?.totalAsset);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };

  useEffect(() => {
    selectedSubscription && getUserTotalAsset();
  }, [selectedSubscription]);

  const getUserAssetData = async () => {
    setloader(true);
    await getUserDetailWithdrawalData(token, selectedSubscription, {
      userId: id
    }).then(res => {
      if (res.success) {
        setUserTotalAsset(res.data?.totalAsset);
        setWithdrawn(res.data?.withdrawn);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getUserAssetData();
  }, [selectedSubscription]);

  const getUserCuurrentMonthData = async () => {
    setloader(true);
    await getUserDetailRoiAndCommision(token, selectedSubscription, {
      userId: id
    }).then(res => {
      if (res.success) {
        setroi(res.data?.roi);
        setcommision(res.data?.commision);
        setMonthGain(res.data?.monthGain);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getUserCuurrentMonthData();
  }, [selectedSubscription]);

  const getUserWalletData = async () => {
    setloader(true);
    await getUserDetailWalletData(token, selectedSubscription, {
      userId: id
    }).then(res => {
      if (res.success) {
        setWalletAmount(res.data?.walletAmount);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getUserWalletData();
  }, [selectedSubscription]);

  const getSubscriptionList = async () => {
    await getallSubscription(token).then(res => {
      if (res.success) {
        setSubscriptionList(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getSubscriptionList();
  }, []);

  const getallUserApprovedSubscription = async () => {
    await getallUserApprovedSubscriptionWithoutpaginationByUserId(
      token,
      id
    ).then(res => {
      if (res.success) {
        setApprovedSubscription(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getallUserApprovedSubscription();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-9 page-container">
        <div className="row justify-content-between">
          <div className="col">
            <h4 className="page-title">User Details</h4>
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
        <div className="row">
          <div className="col">
            {" "}
            <div className="card mb-4 py-3 pl-3">
              <div className="row ">
                <div className="col-sm-6 col-lg-3 mb-3 mb-md-0">
                  <p>
                    <User /> Name : {userpersonaldetails?.name}
                  </p>
                </div>
                <div className="col-sm-6 col-lg-3 mb-3 mb-md-0">
                  <p>
                    <Mail /> Email : {userpersonaldetails?.email}
                  </p>
                </div>
                <div className="col-sm-6 col-lg-3 mb-3 mb-sm-0">
                  <p>
                    <Phone /> Phone No. : {userpersonaldetails?.phone_number}
                  </p>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <p>
                    <Calendar /> Assosiate Date :{" "}
                    {moment(userpersonaldetails?.createdAt).format(
                      "DD/MM/YYYY"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg">
            <div className="top-card top-card-1 flex-wrap greenbox">
              <div className="w-100 dashboardboxheight">
                <p className="top-card-title w-100">Total investment</p>
                <div className="row align-items-center">
                  <div className="col-8">
                    <h1 className="top-card-value mb-0">
                      {userTotalInvestment}
                      {/* {userInvestmentData.currentmonthInvestment} */}
                    </h1>
                  </div>
                  <div className="col-4 pl-0">
                    {subscriptionData && subscriptionData.length > 0 && (
                      <div className="form-group mb-0">
                        <select
                          className="detail-input-select custom-select p-0 border-0"
                          value={selectedSubscription}
                          name="subscription"
                          onChange={e => {
                            // console.log(e.target.value, "check248");
                            setSelectedSubscription(e.target.value);
                          }}
                        >
                          <option hidden disabled value="">
                            Select Currency
                          </option>
                          {subscriptionData.length > 0 &&
                            subscriptionData.map(val => {
                              return (
                                <option value={val.value} key={val.label}>
                                  {val.label}
                                </option>
                              );
                            })}
                          {/* <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option> */}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg">
            <div className="top-card top-card-2 bluebox">
              <div className="card-ul-row">
                <ul>
                  <li>
                    <p className="top-card-title">Total Asset</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">{userTotalAsset}</h1>
                  </li>
                  <li>
                    <p className="top-card-title">Total Withdrawal</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">{withdrawn}</h1>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12">
            <div className="top-card top-card-3 purplebox d-block">
              <ul>
                <li>
                  <p className="top-card-title">Total Roi Gain</p>
                </li>
                <li>
                  <h1 className="top-card-value">{roi}</h1>
                </li>
              </ul>
              <ul>
                <li>
                  <p className="top-card-title">Total Commision Gain</p>
                </li>
                <li>
                  <h1 className="top-card-value">{commision}</h1>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12">
            <div className="top-card top-card-3 orangebox">
              <ul>
                <li>
                  <p className="top-card-title">Pending Withdrawal</p>
                </li>
                <li>
                  <h1 className="top-card-value">{walletAmount}</h1>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {userDetails === "deleted" ? (
          <></>
        ) : (
          <div className="div-container d-flex">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <h2 className="secure-box-title">Existing Package</h2>
              <div className="secure-box-body existing-pack-body">
                {approvedSubscription &&
                  approvedSubscription.length > 0 &&
                  approvedSubscription.map(val => {
                    return <Approvesubscriptionrow value={val} userId={id} />;
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  // console.log(state);
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    notificationData: state.navigation.notificationData,
    user: state.auth.user
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    success,
    error,
    fetching
  })
)(UserDetails);
