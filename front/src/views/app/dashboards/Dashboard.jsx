import usePagination from "@mui/material/usePagination/usePagination";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useFilters, useSortBy, useTable } from "react-table";
import classNames from "classnames";
import NavigationActions from "redux/navigation/actions";
import { getDashboardUserFuturePayout } from "services/futurePaymentServices";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Loader from "components/Loader";
import {
  getUserDashboardCurrentmonthIncomeData,
  getUserDashboardInvestmentData,
  getUserDashboardTotalassetData,
  getUserDashboardWalletData,
  getallUserApprovedSubscriptionWithoutpagination
} from "services/dashboardServices";
import ConformationModaluser from "components/common/ConformationModalUser";
import { getallSubscription } from "services/subscriptionServices";
import { addUserSubscription } from "services/userSubscriptionServices";
import { getallCurrency } from "services/currencyServices";
import Approvesubscriptionrow from "./Approvesubscriptionrow";
import { ChevronDown, ChevronUp } from "react-feather";
import SubscriptionPlanAmountEdit from "views/pages/SubscriptionUserView/SubscriptionPlanAmountEdit";
import { Modal } from "reactstrap";
import AddOtpModal from "views/pages/authentication/AddOtpModal";
import { sendOtp } from "services/userProfileServices";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import CopyButton from "views/pages/admin/CopyButton";
const {
  success,
  error,
  fetching,
  getNotificationData,
  setWalletValue
} = NavigationActions;
// import { TaskWidget } from "components/widgets/taskWidget/TaskWidget";
// import { taskData } from "util/data/taskData";
// import PageviewsChartWidget from "components/widgets/pageviewsChartWidget/PageviewsChartWidget";
// import AnalyticsProcessWidgets from "components/widgets/analyticsProcessWidgets/AnalyticsProcessWidgets";
// import {
//   MiniLineBackgroundWidget,
//   BottomCardLinechartWidget,
//   BottomCardLinechartSecondWidget,
//   MyBalanceWidget,
//   SalePrediction,
//   UserInfoDoughnutWidget,
//   MiniLineChartWidget
// } from "components/widgets/chartwidgets";

// import LatestActivity from "components/widgets/latestactivity/LatestActivity";

// import { LinearProgressWidget } from "components/widgets/statisticswidgets";

const Dashboard = props => {
  const {
    token,
    success,
    error,
    sidebarTheme,
    user,
    history,
    setWalletValue,
    kycStatus
  } = props;
  // const HeaderComponent = (props) => {
  //   let classes = {
  //     "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
  //     "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc,
  //   };
  //   return <div className={classNames(classes)}>{props.title}</div>;
  // };
  // const activeColor = {
  //   color: sidebarTheme.activeColor,
  // };

  // const [futurepaymentData, setFuturePaymentData] = useState([]);
  const [monthGain, setMonthGain] = useState("");
  const [userTotalInvestment, setUserTotalInvestment] = useState("");
  const [userTotalAsset, setUserTotalAsset] = useState("");
  const [withdrawn, setWithdrawn] = useState("");
  const [commision, setcommision] = useState("");
  const [roi, setroi] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // const [userInvestmentData, setUserInvestmentData] = useState({
  //   monthGain: 0,
  //   userTotalInvestment: 0,
  //   userTotalAsset: 0,
  //   commision: 0,
  //   roi: 0,
  //   walletAmount: 0,
  // });
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [selectedSubscriptionData, setSelectedSubscriptionData] = useState({});
  const [approvedSubscription, setApprovedSubscription] = useState([]);
  const [loader, setloader] = useState(false);
  const [loading, setloading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [openInterestBox, setOpenInterestBox] = useState(false);
  const [confirmProps, setConfirmProps] = useState({
    isOpen: false,
    confirmText: "",
    confirmMessage: ""
  });
  const closeConfrimModal = () =>
    setConfirmProps({
      isOpen: false,
      confirmText: "",
      confirmMessage: ""
    });

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
          setSelectedCurrency(res.data[0]?._id);
        }
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getCurrencyList();
  }, []);
  // const getUserDashboardPaymentData = async () => {
  //   setloader(true);
  //   await getDashboardUserFuturePayout(token)
  //     .then((res) => {
  //       console.log(res, "check50");
  //       if (res.success) {
  //         setFuturePaymentData(res.data);
  //         setloader(false);
  //       }
  //     })
  //     .catch((error) => {
  //       error(error);
  //       setloader(false);
  //     });
  // };
  // useEffect(() => {
  //   getUserDashboardPaymentData();
  // }, []);

  const getUserInvestmentData = async () => {
    setloader(true);
    await getUserDashboardInvestmentData(token, selectedCurrency).then(res => {
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
    selectedCurrency && getUserInvestmentData();
  }, [selectedCurrency]);

  const getUserAssetData = async () => {
    setloader(true);
    await getUserDashboardTotalassetData(token, selectedCurrency).then(res => {
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
    selectedCurrency && getUserAssetData();
  }, [selectedCurrency]);

  const getUserCuurrentMonthData = async () => {
    setloader(true);
    await getUserDashboardCurrentmonthIncomeData(token, selectedCurrency).then(
      res => {
        if (res.success) {
          setroi(res.data?.roi);
          setcommision(res.data?.commision);
          setMonthGain(res.data?.monthGain);
          setloader(false);
        } else {
          error(res.message);
          setloader(false);
        }
      }
    );
  };
  useEffect(() => {
    selectedCurrency && getUserCuurrentMonthData();
  }, [selectedCurrency]);

  const getUserWalletData = async () => {
    setloader(true);
    await getUserDashboardWalletData(token, selectedCurrency).then(res => {
      if (res.success) {
        setWalletAmount(res.data?.walletAmount);
        setWalletValue(res.data?.walletAmount);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    selectedCurrency && getUserWalletData();
  }, [selectedCurrency]);

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

  const purchaseSubscription = async id => {
    await addUserSubscription(token, id).then(res => {
      if (res.success) {
        success(res.message);
        closeConfrimModal();
      } else {
        error(res.message);
        closeConfrimModal();
      }
    });
  };

  const getallUserApprovedSubscription = async () => {
    await getallUserApprovedSubscriptionWithoutpagination(token).then(res => {
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

  // const handleSendOtp = async (e) => {
  //   e.preventDefault();
  //   // if (kycStatus) {
  //   setloading(true);
  //   await sendOtp({ email: user?.email }).then((res) => {
  //     if (res.success) {
  //       success(res.message);
  //       setloading(false);
  //       setIsOpen(true);
  //     } else {
  //       error(res.message);
  //       setloading(false);
  //     }
  //   });
  //   // } else {
  //   //   error("Please Verify your kyc.");
  //   // }
  // };
  // console.log(user?.is_kyc_verified, "check290");
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: (tableInstance) => {
  //         return (
  //           <HeaderComponent
  //             isSortedDesc={tableInstance.column.isSortedDesc}
  //             title="No"
  //           />
  //         );
  //       },
  //       placeholder: "sr no",
  //       disableFilters: true,
  //       disableSortBy: true,
  //       accessor: "__id",
  //       Cell: (tableInstance) => <span>{tableInstance.row.index + 1}</span>,
  //     },
  //     {
  //       Header: (tableInstance) => {
  //         return (
  //           <HeaderComponent
  //             isSortedDesc={tableInstance.column.isSortedDesc}
  //             title="Subscription Name"
  //           />
  //         );
  //       },
  //       // Filter: FilterComponent,
  //       placeholder: "Subscription Name",
  //       disableFilters: true,
  //       disableSortBy: true,
  //       accessor: "userSubscriptionId.name",
  //       Cell: (tableInstance) => (
  //         <span>{tableInstance.row.original.userSubscriptionId?.name}</span>
  //       ),
  //     },
  //     {
  //       Header: (tableInstance) => {
  //         return (
  //           <HeaderComponent
  //             isSortedDesc={tableInstance.column.isSortedDesc}
  //             title="Amount"
  //           />
  //         );
  //       },
  //       // Filter: FilterComponent,
  //       placeholder: "Amount",
  //       disableFilters: true,
  //       disableSortBy: true,
  //       accessor: "roi",
  //       Cell: (tableInstance) => <span>{tableInstance.row.values?.roi}</span>,
  //     },
  //     {
  //       Header: (tableInstance) => {
  //         return (
  //           <HeaderComponent
  //             isSortedDesc={tableInstance.column.isSortedDesc}
  //             title="Currency"
  //           />
  //         );
  //       },
  //       // Filter: FilterComponent,
  //       placeholder: "Currency",
  //       disableFilters: true,
  //       disableSortBy: true,
  //       accessor: "currency",
  //       Cell: (tableInstance) => (
  //         <span>{tableInstance.row.values?.currency}</span>
  //       ),
  //     },
  //     {
  //       Header: (tableInstance) => {
  //         return (
  //           <HeaderComponent
  //             isSortedDesc={tableInstance.column.isSortedDesc}
  //             title="Receive By"
  //           />
  //         );
  //       },
  //       placeholder: "Receive By",
  //       disableFilters: true,
  //       disableSortBy: true,
  //       accessor: "roi_date",
  //       Cell: (tableInstance) => (
  //         <span>
  //           {moment(tableInstance.row.values.roi_date).format("DD/MM/YYYY")}
  //           {/* {tableInstance.row.values.tasklist_status} */}
  //         </span>
  //       ),
  //     },
  //   ],
  //   // eslint-disable-next-line
  //   [futurepaymentData]
  // );
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   prepareRow,
  //   headerGroups,
  //   rows,
  //   state: { sortBy },
  // } = useTable(
  //   {
  //     data: futurepaymentData,
  //     columns: columns,
  //     manualSortBy: true,
  //     initialState: {
  //       pageSize: 10,
  //       pageIndex: 0,
  //     },
  //   },
  //   useFilters,
  //   useSortBy,
  //   usePagination
  // );

  return (
    <div className="row">
      <div className="col-lg-9 page-container">
        <div className="row justify-content-between">
          <div className="col-auto">
            <h4 className="page-title">Dashboard</h4>
          </div>
          <div className="col-md-auto">
            {/* <div className="m-2">
              <CopyButton
                referralCode={user?.referral_code}
                text={"Referral Code :"}
              />
            </div> */}
            <div className="my-2 coputext-row">
              <CopyButton
                referralCode={`${process.env.REACT_APP_BACKEND_URI}/register?id=${user?.referral_code}`}
                text={"Referral Link :"}
              />
            </div>
          </div>
        </div>
        <div className="row dashboard-card-row">
          <div className="col-xxl-3 col-md-6">
            <div className="top-card top-card-1 flex-wrap greenbox">
              <div className="w-100 dashboardboxheight">
                <p className="top-card-title w-100">Total investment</p>
                <div className="row align-items-center justify-content-between">
                  <div className="col pr-0">
                    <h1 className="top-card-value mb-0">
                      {userTotalInvestment}
                      {/* {userInvestmentData.currentmonthInvestment} */}
                    </h1>
                  </div>
                  <div className="col-auto usdt-col">
                    {subscriptionData && subscriptionData.length > 0 && (
                      <div className="form-group mb-0">
                        <select
                          className="detail-input-select custom-select p-0 border-0"
                          value={selectedCurrency}
                          name="subscription"
                          onChange={e => {
                            // console.log(e.target.value, "check248");
                            setSelectedCurrency(e.target.value);
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
          <div className="col-xxl-3 col-md-6">
            <div className="top-card top-card-2 bluebox">
              <div className="card-ul-row">
                <ul>
                  <li>
                    <p className="top-card-title">Total Asset</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">{userTotalAsset}</h1>
                  </li>
                </ul>
                <ul>
                  <li>
                    <p className="top-card-title">Withdrawn</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">
                      {withdrawn}
                      {/* {userInvestmentData.userTotalInvestment} */}
                    </h1>
                  </li>
                </ul>
              </div>
              {/* <ul className="top-card-plan">
                <li className="silver">
                  <p>silver</p>
                </li>
                <li className="gold">
                  <p>Gold</p>
                </li>
                <li className="platinum">
                  <p>Platinum</p>
                </li>
              </ul> */}
            </div>
          </div>
          <div className="col-xxl-3 col-md-6">
            <div className="top-card top-card-3 purplebox">
              <ul>
                <li>
                  <p className="top-card-title">Current month income</p>
                </li>
                <li>
                  <div className="row justify-content-between">
                    <div className="col">
                      <h1 className="top-card-value">{monthGain}</h1>
                    </div>
                    <div className="col text-right">
                      <span
                        onClick={() => {
                          setOpenInterestBox(!openInterestBox);
                        }}
                      >
                        {openInterestBox ? <ChevronUp /> : <ChevronDown />}
                      </span>
                    </div>
                  </div>
                </li>
                {openInterestBox ? (
                  <li>
                    {user?.isReffral ? (
                      <p className="top-card-title">Commision: {commision}</p>
                    ) : (
                      <></>
                    )}
                    <p className="top-card-title">ROI: {roi}</p>
                  </li>
                ) : (
                  <></>
                )}
                {/* <li>
                  <div className="top-card-bottom">
                    <ul>
                      <li>
                        <div className="growth-graph">
                          <img src="images/icon-graph-inrement.svg" alt="" />
                          3%
                          <p>Increase</p>
                        </div>
                      </li>
                      <li>
                        <p>Monthly</p>
                      </li>
                    </ul>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="col-xxl-3 col-md-6">
            <div className="top-card top-card-3 orangebox">
              <ul>
                <li>
                  <p className="top-card-title">Balance</p>
                </li>
                <li>
                  <h1 className="top-card-value">{walletAmount}</h1>
                </li>
                <li>
                  <button
                    className="btn btn-blue dashboard-btn-blue"
                    onClick={e => {
                      // handleSendOtp(e);
                      history.push(
                        `/choose-withdrawal-method/${selectedCurrency}`
                      );
                    }}
                    // disabled={!(walletAmount <= 0 && user?.is_kyc_verified)}
                    // disabled={walletAmount <= 0 && !user?.is_kyc_verified}
                  >
                    Withdraw
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="div-container">
          <div className="secure-admin-box">
            <h2 className="secure-box-title justify-content-between">
              Packages
              {/* <p>
                Total Packages : <b>5</b>
              </p> */}
            </h2>
            <div className="secure-box-body">
              <OwlCarousel
                // items={8}
                className="owl-theme resource-owl-carousel"
                loop={
                  subscriptionList && subscriptionList.length > 2 ? true : false
                }
                autoplay
                autoplayHoverPause
                autoplayTimeout={2000}
                margin={30}
                responsive={{
                  0: {
                    items: 1
                  },
                  575: {
                    items: 2
                  },
                  991: {
                    items: 3
                  }
                }}
              >
                {subscriptionList?.length > 0 &&
                  subscriptionList.map(val => {
                    return (
                      <div className="subscriptioncardhover" key={val._id}>
                        <div className="subscriptioncard">
                          <h4>{val.name}</h4>
                          <p
                            className="plan-description three-line-plan-description"
                            dangerouslySetInnerHTML={{
                              __html: val.description
                            }}
                          />
                          <div className="sub-detail-box">
                            Amount
                            <p className="large-text">
                              {val.minimum_value} {val.currency}
                            </p>
                          </div>
                          <div className="sub-detail-box">
                            Rate of Interest
                            <p className="large-text">{val.roi}%</p>
                          </div>
                          <div className="sub-detail-box">
                            ROI Frequency
                            <p className="large-text">{val.roi_duration}</p>
                          </div>
                          <div className="sub-detail-box">
                            Duration
                            <p className="large-text">
                              {val.duration === 1
                                ? `${val.duration} Month`
                                : `${val.duration} Months`}
                            </p>
                          </div>
                          <button
                            className="btn btn-blue subscriptionbtn w-100"
                            onClick={() => {
                              // setConfirmProps({
                              //   isOpen: true,
                              //   confirmText: "Yes",
                              //   confirmMessage: `Are you sure you want to invest in ${val.name} subscription?`,
                              //   confirmFunc: () =>
                              //     purchaseSubscription(val._id),
                              // });
                              // setOpenModal(true);
                              // setSelectedSubscriptionData(val);
                              history.push(`choosePaymentMethod/${val._id}`);
                            }}
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </OwlCarousel>
            </div>
          </div>
        </div>
        <div className="div-container d-flex">
          <div className="secure-admin-box mb-5 mb-sm-0">
            <h2 className="secure-box-title">Existing Package</h2>
            <div className="secure-box-body existing-pack-body">
              {approvedSubscription &&
                approvedSubscription.length > 0 &&
                approvedSubscription.map(val => {
                  return <Approvesubscriptionrow value={val} />;
                })}
            </div>
          </div>
        </div>
        {/* <div className="div-container">
          <ReactTableWrapper {...props}>
            <div className="table-responsive table-container">
              <p className="custom-table-title">
                Upcoming month interest return
              </p>
              <table
                className="custom-react-table-theme-class"
                {...getTableProps()}
              >
                <thead className="thead-color text-capitalize">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((header) => (
                        <th
                          className="td-header"
                          {...header.getHeaderProps(
                            header.getSortByToggleProps()
                          )}
                        >
                          <div>{header.render("Header")}</div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td>
                        <Loader />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody {...getTableBodyProps()}>
                    {rows.length > 0 ? (
                      rows.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                              <td
                                className="td-border"
                                {...cell.getCellProps()}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="td-border" colSpan={columns?.length}>
                          <h6>No Data Found</h6>
                        </td>
                      </tr>
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </ReactTableWrapper>
        </div> */}
      </div>
      <Modal isOpen={openModal} backdrop={true}>
        {openModal && (
          <SubscriptionPlanAmountEdit
            subscriptionData={selectedSubscriptionData}
            onClose={() => {
              setOpenModal(false);
            }}
          />
        )}
      </Modal>
      {/* {console.log(selectedCurrency, "check722")} */}
      <Modal isOpen={isOpen} backdrop={true} centered>
        <AddOtpModal
          onClose={() => {
            setIsOpen(false);
          }}
          email={user?.email}
          path="Withdrawal"
          selectedCurrency={selectedCurrency}
          walletAmount={walletAmount}
        />
      </Modal>
      {/* {confirmProps.isOpen && (
        <ConformationModaluser
          isOpen={confirmProps.isOpen}
          onClose={() => closeConfrimModal()}
          confirmText={confirmProps.confirmText}
          message={confirmProps.confirmMessage}
          handleConfirm={confirmProps.confirmFunc}
          customIcon={confirmProps?.icon?.type}
        />
      )} */}
      {loading ? <Loader /> : <></>}
    </div>
  );
};
const mapStateToProps = state => {
  // console.log(state, "check758");
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    notificationData: state.navigation.notificationData,
    user: state.auth.user,
    kycStatus: state.navigation.kycStatus
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    success,
    error,
    fetching,
    setWalletValue
  })
)(Dashboard);
