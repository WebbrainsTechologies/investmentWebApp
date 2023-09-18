import classNames from "classnames";
import Loader from "components/Loader";
import BarChartComponent from "components/charts/BarChartComponent";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import { getallCurrency } from "services/currencyServices";
import NavigationActions from "redux/navigation/actions";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAdminDashboardChartData,
  getAdminDashboardData,
  getAdminDashboardSubscription,
  getAdminDashboardSubscriptionData,
  editAdminWalletData,
  getAdminWalletData,
  getAdminPendingWithdrawalData,
  getAdminDashboardWithdrawalDataByMonth,
  getUserTotalAssetForAdmin
} from "services/dashboardServices";
import DatePicker from "react-datepicker";
const { success, error, fetching, getNotificationData } = NavigationActions;

const AdminDashboard = props => {
  const { token, success, error, sidebarTheme, getNotificationData } = props;

  const [loader, setloader] = useState(false);
  const [dashboardSubscriptionData, setDashboardSubscriptionData] = useState(
    []
  );
  const [togglerefresh, setToggleRefresh] = useState(false);
  const [chartRefresh, setChartRefresh] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState("");
  const [adminWalletBalance, setAdminWalletBalance] = useState("");
  const [
    adminDashboardPendingWithdrawal,
    setAdminDashboardPendingWithdrawal
  ] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date()?.getMonth());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [userInvestmentData, setUserInvestmentData] = useState({
    TotalInvestment: 0,
    CurrentMonthInvestment: 0
  });
  const [selectedMonthwithdrawal, setSelectedMonthWithdrawal] = useState({
    CurrentMonthWithdrawal: 0,
    firstDate: 0,
    elevenDate: 0,
    twentyoneDate: 0
  });
  const [totalUserAsset, setTotalUserAsset] = useState(0);

  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };
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
          setToggleRefresh(true);
          setChartRefresh(true);
        }
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getCurrencyList();
  }, []);
  const getAdminDashboardPendingWithdrawal = async () => {
    await getAdminPendingWithdrawalData(token, selectedSubscription).then(
      res => {
        if (res.success) {
          setAdminDashboardPendingWithdrawal(res.data?.PendingWithdrawal);
        } else {
          error(res.message);
        }
      }
    );
  };
  useEffect(() => {
    selectedSubscription && getAdminDashboardPendingWithdrawal();
  }, [selectedSubscription]);
  const getAdminDashboardTotalAsset = async () => {
    await getUserTotalAssetForAdmin(token, selectedSubscription).then(res => {
      if (res.success) {
        setTotalUserAsset(res.data?.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getAdminDashboardTotalAsset();
  }, [selectedSubscription]);
  const getAdminDashboardBalance = async () => {
    await getAdminWalletData(token, selectedSubscription).then(res => {
      if (res.success) {
        setAdminWalletBalance(res.data.amount);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && getAdminDashboardBalance();
  }, [selectedSubscription]);
  // const getAdminSubscriptionfordashboard = async () => {
  //   await getAdminDashboardSubscription(token).then((res) => {
  //     console.log(res.data, "check59");
  //     if (res.success) {
  //       if (res.data?.length > 0) {
  //         setSubscriptionData(
  //           res.data?.map((val) => {
  //             console.log(val, "checkvale");
  //             return {
  //               label: val.name,
  //               value: val._id,
  //             };
  //           })
  //         );
  //         setSelectedSubscription(res.data[0]?._id);
  //       }
  //     } else {
  //       error(res.message);
  //     }
  //   });
  // };

  const getAdminDashboardSubscriptionList = async () => {
    setloader(true);
    await getAdminDashboardSubscriptionData(token)
      .then(res => {
        // console.log(res, "check50");
        if (res.success) {
          setDashboardSubscriptionData(res.data);
          setloader(false);
        }
      })
      .catch(error => {
        error(error);
        setloader(false);
      });
  };
  useEffect(() => {
    getAdminDashboardSubscriptionList();
  }, []);

  const getAdminInvestmentData = async () => {
    setloader(true);
    await getAdminDashboardData(token, selectedSubscription).then(res => {
      if (res.success) {
        setUserInvestmentData(res.data);
        setToggleRefresh(false);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  useEffect(() => {
    togglerefresh && getAdminInvestmentData();
  }, [togglerefresh]);

  const getAdminWithdrawalData = async () => {
    await getAdminDashboardWithdrawalDataByMonth(token, selectedSubscription, {
      selectedDate: selectedMonth.toUTCString()
    }).then(res => {
      if (res.success) {
        setSelectedMonthWithdrawal(res.data);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    selectedSubscription && selectedMonth && getAdminWithdrawalData();
  }, [selectedMonth, selectedSubscription]);

  const getAdminchartData = async () => {
    await getAdminDashboardChartData(token, selectedSubscription).then(res => {
      // console.log(res, "check188");
      if (res.success) {
        setChartData(res.data);
        setChartRefresh(false);
      } else {
        error(res.message);
      }
    });
  };
  // console.log(selectedSubscription, "checkvalues138");
  useEffect(() => {
    chartRefresh && getAdminchartData();
  }, [chartRefresh]);
  const handleBalanceChange = async () => {
    await editAdminWalletData(token, selectedSubscription, {
      amount: adminWalletBalance
    }).then(res => {
      if (res.success) {
        setAdminWalletBalance(res.data?.amount);
        success(res.message);
      } else {
        error(res.message);
      }
    });
  };
  const columns = useMemo(
    () => [
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="No"
            />
          );
        },
        placeholder: "sr no",
        disableFilters: true,
        disableSortBy: true,
        accessor: "__id",
        Cell: tableInstance => <span>{tableInstance.row.index + 1}</span>
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="User Name"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "User Name",
        disableFilters: true,
        disableSortBy: true,
        accessor: "userId.name",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.original.userId?.name}
            {/* {console.log(tableInstance.row.original, "checkvalue")} */}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Subscription Name"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Subscription Name",
        disableFilters: true,
        disableSortBy: true,
        accessor: "name",
        Cell: tableInstance => <span>{tableInstance.row.original?.name}</span>
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Currency"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Currency",
        disableFilters: true,
        disableSortBy: true,
        accessor: "currency",
        Cell: tableInstance => (
          <span>{tableInstance.row.original?.currency}</span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Amount"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Amount",
        disableFilters: true,
        disableSortBy: true,
        accessor: "amount",
        Cell: tableInstance => (
          <span>{tableInstance.row.original?.amount?.toFixed(2)}</span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Duration"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Duration",
        disableFilters: true,
        disableSortBy: true,
        accessor: "duration",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.original?.duration === 1
              ? `${tableInstance.row.original?.duration} Month`
              : `${tableInstance.row.original?.duration} Months`}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Investment Date"
            />
          );
        },
        placeholder: "investmentdate",
        disableFilters: true,
        disableSortBy: true,
        accessor: "createdAt",
        Cell: tableInstance => (
          <span>
            {moment(tableInstance.row.values.createdAt).format("DD/MM/YYYY")}
            {/* {tableInstance.row.values.tasklist_status} */}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Status"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "usersubscriptionstatus",
        Cell: tableInstance => (
          <span>
            <div
              className={
                tableInstance.row.values?.usersubscriptionstatus === "Accepted"
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {tableInstance.row.values?.usersubscriptionstatus}
            </div>
          </span>
        )
      }
    ],
    // eslint-disable-next-line
    [dashboardSubscriptionData]
  );
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
    state: { sortBy }
  } = useTable(
    {
      data: dashboardSubscriptionData,
      columns: columns,
      manualSortBy: true,
      initialState: {
        pageSize: 10,
        pageIndex: 0
      }
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="row">
      <div className="col-lg-9 page-container">
        <h4 className="page-title">Dashboard</h4>
        <div className="row">
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-1 flex-wrap greenbox">
              <div className="w-100 dashboardboxheight">
                <p className="top-card-title w-100">Total investment</p>
                <div className="row align-items-center">
                  <div className="col-8">
                    <h1 className="top-card-value mb-0">
                      {userInvestmentData.TotalInvestment}
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
                            setSelectedSubscription(e.target.value);
                            setToggleRefresh(true);
                            setChartRefresh(true);
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
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-2 flex-wrap bluebox">
              <div className="w-100 dashboardboxheight">
                <p className="top-card-title w-100">Current Month Withdrawal</p>
                <div className="row align-items-center">
                  <div className="col-8">
                    <h1 className="top-card-value">
                      {selectedMonthwithdrawal.CurrentMonthWithdrawal}
                    </h1>
                  </div>
                  <div className="col-4 pl-0">
                    {subscriptionData && subscriptionData.length > 0 && (
                      <div className="form-group mb-0">
                        <DatePicker
                          className="custom-datepicker form-control"
                          selected={selectedMonth}
                          renderMonthContent={currentMonth}
                          showMonthYearPicker
                          dateFormat="MM/yyyy"
                          onChange={date => {
                            if (date) {
                              setCurrentMonth(date.getMonth());
                              setSelectedMonth(date);
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {moment(selectedMonth)
                      .date(1)
                      .format("DD/MM/YYYY")}{" "}
                    :<strong> {selectedMonthwithdrawal.firstDate}</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {moment(selectedMonth)
                      .date(11)
                      .format("DD/MM/YYYY")}{" "}
                    :<strong> {selectedMonthwithdrawal.elevenDate}</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {moment(selectedMonth)
                      .date(21)
                      .format("DD/MM/YYYY")}{" "}
                    :<strong> {selectedMonthwithdrawal.twentyoneDate}</strong>
                  </div>
                </div>
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
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-3 purplebox">
              <ul>
                <li>
                  <p className="top-card-title">Current month investment</p>
                </li>
                <li>
                  <h1 className="top-card-value">
                    {userInvestmentData.CurrentMonthInvestment}
                  </h1>
                </li>
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
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-2 yellowbox">
              <div className="card-ul-row">
                <ul>
                  <li>
                    <p className="top-card-title">Pending Withdrawal</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">
                      {adminDashboardPendingWithdrawal}
                    </h1>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-2 yellowbox">
              <div className="card-ul-row">
                <ul>
                  <li>
                    <p className="top-card-title">Users total assets</p>
                  </li>
                  <li>
                    <h1 className="top-card-value">{totalUserAsset}</h1>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-6">
            <div className="top-card top-card-3 orangebox">
              <ul>
                <li>
                  <p className="top-card-title">Balance</p>
                </li>
                <li>
                  <h1 className="top-card-value">
                    {userInvestmentData.walletAmount}
                  </h1>
                </li>
                <li className="mb-2">
                  <input
                    type="text"
                    className="form-control react-form-input"
                    value={adminWalletBalance}
                    pattern="^\d+(\.\d+)?$"
                    title="Please enter a valid number"
                    onChange={e => {
                      setAdminWalletBalance(e.target.value);
                    }}
                  />
                </li>
                <li>
                  <button
                    className="btn btn-blue dashboard-btn-blue"
                    onClick={() => {
                      handleBalanceChange();
                    }}
                  >
                    save
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {chartData && chartData?.length > 0 && (
          <div className="chart-card mb-5">
            <BarChartComponent apidata={chartData} />
          </div>
        )}
        <div className="div-container">
          <ReactTableWrapper {...props}>
            <div className="table-responsive table-container">
              <p className="custom-table-title">Recent Subscription</p>
              <table
                className="custom-react-table-theme-class"
                {...getTableProps()}
              >
                <thead className="thead-color text-capitalize">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(header => (
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
                      rows.map(row => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
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
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  // console.log(state);
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default connect(mapStateToProps, {
  success,
  error,
  fetching
})(AdminDashboard);
