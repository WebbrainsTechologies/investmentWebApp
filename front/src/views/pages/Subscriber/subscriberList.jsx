import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { Modal } from "reactstrap";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Pagination from "components/common/Pagination";
import { Edit3, Eye } from "react-feather";
import Loader from "components/Loader";
import ConformationModal from "components/common/ConformationModalUser";
import {
  deleteSubscription,
  getallSubscriptionForSubscriberpage
} from "services/subscriptionServices";
import ConformationModaluser from "components/common/ConformationModalUser";
import {
  changeSubscriberSubscriptionStatus,
  getSubscriberSubscription
} from "services/userSubscriptionServices";
import moment from "moment";
import AcceptRejectModal from "./AcceptRejectModal";
import EditSubscriberStatusModal from "./EditSubscriberStatusModal";
import {
  userlist,
  userlistwithoutpagination
} from "services/userProfileServices";
import { getallDuration } from "services/durationServices";
import { getallCurrency } from "services/currencyServices";

// import { SubscriptionAllDetails } from "services/subscriptionServices";

const { success, error, fetching, getNotificationData } = NavigationActions;
const { setuser } = AuthActions;
let debounceTimer;

const SubscriberList = props => {
  const { token, success, error, sidebarTheme, getNotificationData } = props;
  const [editModal, setEditModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  // const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [sortObject, setSortObject] = useState({ id: "createdAt", desc: true });
  // const [openDeleteModal, toggleDeleteModalOpen] = useState();
  const [totalRecords, setTotalRecords] = useState("0");
  // const [dataLength, setDataLength] = useState(0);

  //eslint-disable-next-line
  const [deleteId, setDeleteID] = useState("");
  const [loader, setloader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [usernameFilter, setUserNameFilter] = useState("");
  const [subscriptionnameFilter, SetSubscriptionNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [currencyFilter, setCurrencyFliter] = useState("");
  const [durationFilter, setDurationFliter] = useState("");
  const [username, setUserName] = useState([]);
  const [subscriptionname, SetSubscriptionName] = useState([]);
  const [currencydata, setCurrencyData] = useState([]);
  const [durationdata, setDurationData] = useState([]);
  const [amountData, setAmountData] = useState([
    {
      value: 100,
      label: "less than or equal 100"
    },
    {
      value: 1000,
      label: "grater than 100 & less than 1000"
    },
    {
      value: 1001,
      label: "grater than or equal 1000"
    }
  ]);
  const [apiData, setApiData] = useState({
    usersubscriptionstatus: "",
    userId: "",
    notificationId: ""
  });
  const handleClear = async () => {
    await setApiData({
      usersubscriptionstatus: "",
      userId: "",
      notificationId: ""
    });
  };
  const updateStatus = async () => {
    fetching();
    // console.log(statusModalOpen, "checkmodal");
    await changeSubscriberSubscriptionStatus(token, selectedId, apiData).then(
      data => {
        if (data.success) {
          success(data.message);
          setSelectedId("");
          handleClear();
          setStatusModalOpen(false);
          getNotificationData(token);
          toggleRefresh(true);
        } else {
          error(data.message);
          handleClear();
          setStatusModalOpen(false);
          setSelectedId("");
        }
      }
    );
  };

  const getAllUser = async () => {
    await userlistwithoutpagination(token).then(res => {
      if (res.success) {
        setUserName(
          res.data?.map(val => {
            return { value: val._id, label: val.name };
          })
        );
      } else {
        error(res.message);
      }
    });
  };
  const getallSubscription = async () => {
    await getallSubscriptionForSubscriberpage(token).then(res => {
      if (res.success) {
        SetSubscriptionName(
          res.data?.map(val => {
            return { value: val._id, label: val.name };
          })
        );
      } else {
        error(res.message);
      }
    });
  };

  const getAllDuration = async () => {
    await getallDuration(token).then(res => {
      // console.log(res, "check126");
      if (res.success) {
        setDurationData(
          res.data?.map(val => {
            return {
              value: val.month,
              label:
                val.month === 1 ? val.month + " month" : val.month + " months"
            };
          })
        );
      } else {
        error(res.message);
      }
    });
  };

  const getAllCurrency = async () => {
    await getallCurrency(token).then(res => {
      if (res.success) {
        setCurrencyData(
          res.data?.map(val => {
            return { value: val._id, label: val.name };
          })
        );
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getAllUser();
    getallSubscription();
    getAllDuration();
    getAllCurrency();
  }, []);

  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };
  const activeColor = {
    color: sidebarTheme.activeColor
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
        // disableFilters: true,
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
          // console.log("tableinstance status", tableInstance);
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
          <div
            className={
              tableInstance.row.values?.usersubscriptionstatus === "Accepted"
                ? "status-active"
                : "status-inactive"
            }
          >
            {tableInstance.row.values?.usersubscriptionstatus}
          </div>
        )
      },
      {
        Header: tableInstance => {
          // console.log("tableinstance status", tableInstance);
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Action"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Action",
        disableFilters: true,
        disableSortBy: true,
        accessor: "id",
        Cell: tableInstance => (
          <div className="react-action-class">
            <button
              className="table-action action-edit"
              onClick={() => {
                let status = tableInstance.row.values?.usersubscriptionstatus;
                if (
                  status === "Accepted" ||
                  status === "Rejected" ||
                  status === "Closed" ||
                  status === "Cancelled"
                ) {
                  setIsApproved(true);
                }
                setEditData(tableInstance?.row?.original);
                setIsEdit(true);
                setEditModal(true);
              }}
            >
              <Edit3 className="table-icon-edit" />
            </button>
          </div>
        )
      }
      // {
      //   Header: tableInstance => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Created Date"
      //       />
      //     );
      //   },
      //   placeholder: "createddate",
      //   // disableFilters: true,
      //   accessor: "createdAt",
      //   Cell: tableInstance => (
      //     <span>
      //       {moment(tableInstance.row.values.createdAt).format("DD/MM/YYYY")}
      //       {/* {tableInstance.row.values.tasklist_status} */}
      //     </span>
      //   )
      // },
      // {
      //   Header: tableInstance => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Action"
      //       />
      //     );
      //   },

      //   accessor: "_id",
      //   disableSortBy: true,
      //   disableFilters: true,
      //   Cell: tableInstance => {
      //     return (
      //       <div className="react-action-class">
      //         <button
      //           className="table-action action-view"
      //           onClick={() => {
      //             setEditData(tableInstance.row.original);
      //             setIsView(true);
      //             setOpenModal(true);
      //           }}
      //         >
      //           <Eye className="table-icon-edit" />
      //         </button>
      //         <button
      //           className="table-action action-edit"
      //           onClick={() => {
      //             setEditData(tableInstance.row.original);
      //             setIsEdit(true);
      //             setOpenModal(true);
      //           }}
      //         >
      //           <Edit3 className="table-icon-edit" />
      //         </button>
      //         {/* <button
      //           className="action-delete"
      //           onClick={() => {
      //             toggleDeleteModalOpen(true);
      //             setDeleteID(tableInstance.row.original?._id);
      //           }}
      //         >
      //           <Trash2 />
      //         </button> */}
      //       </div>
      //     );
      //   }
      // }
    ],
    // eslint-disable-next-line
    [packageList]
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
      data: packageList,
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

  const getServiceHandler = useCallback(async () => {
    // console.log(sortObject, "check218");
    const data = {
      limit: pageLength,
      page: currentPage + 1,
      sort_on: sortObject.id ? sortObject.id : "createdAt",
      sort:
        sortObject.desc !== undefined
          ? sortObject.desc
            ? "desc"
            : "asc"
          : "desc",
      usernameFilter: usernameFilter,
      subscriptionnameFilter: subscriptionnameFilter,
      currencyFilter: currencyFilter,
      durationFilter: durationFilter,
      amountFilter: amountFilter
    };
    // console.log(data, "check229");
    setloader(true);
    await getSubscriberSubscription(token, data)
      .then(res => {
        // console.log(res.data, "check72");
        setPackageList(res.data?.docs);
        // setDataLength(res.data?.docs?.length);
        setTotalRecords(res.data?.totalDocs);
        setTotalPage(res.data?.totalPages);
        toggleRefresh(false);
        success();
        setloader(false);
      })
      .catch(err => {
        error(err.message);
        setloader(false);
      });
    //eslint-disable-next-line
  }, [
    currentPage,
    sortObject,
    usernameFilter,
    subscriptionnameFilter,
    currencyFilter,
    durationFilter,
    amountFilter
  ]);

  useEffect(() => {
    refresh && getServiceHandler();
  }, [refresh]);
  // useEffect(() => {
  //   if (search !== undefined) {
  //     const timeOutId = setTimeout(() => getServiceHandler(), 1000);
  //     return () => clearTimeout(timeOutId);
  //   }
  //   //eslint-disable-next-line
  // }, [search]);

  useEffect(() => {
    // Call api here
    setCurrentPage(0);
    toggleRefresh(true);
  }, [sortObject, pageLength]);

  useEffect(() => {
    setSortObject({ ...sortBy[0] });
    toggleRefresh(true);
  }, [sortBy]);

  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
    toggleRefresh(true);
  };
  // const deleteClick = async () => {
  //   setloader(true);
  //   await deleteSubscription(token, deleteId).then(res => {
  //     // console.log(res, "item to delete");
  //     if (res.success) {
  //       success(res.message);
  //       // setPageCng(
  //       //   dataLength === 1 ? (pageCng !== 1 ? pageCng - 1 : pageCng) : pageCng
  //       // );
  //       console.log(
  //         dataLength === 1
  //           ? currentPage !== 0
  //             ? currentPage - 1
  //             : currentPage
  //           : currentPage,
  //         "check284"
  //       );
  //       setCurrentPage(currentPage !== 0 ? currentPage - 1 : currentPage);
  //       toggleRefresh(true);
  //       toggleDeleteModalOpen(false);
  //       setloader(false);
  //     } else {
  //       error(res.message);
  //       setloader(false);
  //     }
  //   });
  // };
  return (
    <>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col">
          <h4 className="page-title" style={activeColor}>
            Subscribers
          </h4>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <select
                className="detail-input-select custom-select w-100"
                value={usernameFilter}
                onChange={e => {
                  setUserNameFilter(e.target.value);
                  setCurrentPage(0);
                  toggleRefresh(true);
                }}
              >
                <option value="" hidden>
                  Select user
                </option>
                {/* {console.log(roomData, "roomData")} */}
                {username?.length > 0 &&
                  username.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <select
                className="detail-input-select custom-select w-100"
                value={subscriptionnameFilter}
                onChange={e => {
                  SetSubscriptionNameFilter(e.target.value);
                  setCurrentPage(0);
                  toggleRefresh(true);
                }}
              >
                <option value="" hidden>
                  Select Subscription
                </option>
                {/* {console.log(roomData, "roomData")} */}
                {subscriptionname?.length > 0 &&
                  subscriptionname.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <select
                className="detail-input-select custom-select w-100"
                value={amountFilter}
                onChange={e => {
                  setAmountFilter(e.target.value);
                  setCurrentPage(0);
                  toggleRefresh(true);
                }}
              >
                <option value="" hidden>
                  Select Amount
                </option>
                {/* {console.log(roomData, "roomData")} */}
                {amountData?.length > 0 &&
                  amountData.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <select
                className="detail-input-select custom-select w-100"
                value={currencyFilter}
                onChange={e => {
                  setCurrencyFliter(e.target.value);
                  setCurrentPage(0);
                  toggleRefresh(true);
                }}
              >
                <option value="" hidden>
                  Select Currency
                </option>
                {/* {console.log(roomData, "roomData")} */}
                {currencydata?.length > 0 &&
                  currencydata.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <select
                className="detail-input-select custom-select w-100"
                value={durationFilter}
                onChange={e => {
                  setDurationFliter(e.target.value);
                  setCurrentPage(0);
                  toggleRefresh(true);
                }}
              >
                <option value="" hidden>
                  Select Duration
                </option>
                {/* {console.log(roomData, "roomData")} */}
                {durationdata?.length > 0 &&
                  durationdata.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2 mb-2 mb-md-0">
              <button
                className="btn btn-blue"
                onClick={() => {
                  setAmountFilter("");
                  setUserNameFilter("");
                  setDurationFliter("");
                  setCurrencyFliter("");
                  SetSubscriptionNameFilter("");
                  toggleRefresh(true);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* <div className="col-auto">
          <button
            className="btn btn-blue"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Add Subscription
          </button>
        </div> */}
      </div>
      <div>
        {/* {loader ? (
            <>
              <div className="d-flex">
                <div className="mx-auto text-center">
                  <Loader/>
                </div>
              </div>
            </>
          ) : ( */}
        <div className="div-container">
          <ReactTableWrapper {...props}>
            <div className="table-responsive table-container">
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
            <Pagination
              onPageChange={handlePageChange}
              pages={totalPage}
              page={currentPage}
            />
          </ReactTableWrapper>
        </div>
        {/* )} */}
        {/* <Modal isOpen={statusModalOpen} backdrop={true}>
          {statusModalOpen && (
            <ConformationModaluser
              isOpen={statusModalOpen}
              onClose={() => setStatusModalOpen(false)}
              confirmText={
                apiData.usersubscriptionstatus === "Accepted"
                  ? "Accept"
                  : "Reject"
              }
              message={`Are you sure you want to ${
                apiData.usersubscriptionstatus === "Accepted"
                  ? "Accept"
                  : "Reject"
              } subscription?`}
              handleConfirm={() => updateStatus()}
            />
          )}
        </Modal> */}
        <Modal isOpen={editModal} backdrop={true} centered>
          <EditSubscriberStatusModal
            isOpen={editModal}
            toggleRefresh={() => toggleRefresh(!refresh)}
            isApproved={isApproved}
            onClose={() => {
              handleClear();
              setEditModal(false);
              setSelectedId("");
              setIsApproved(false);
            }}
            apiData={apiData}
            editData={editData}
            selectedId={selectedId}
          />
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = state => {
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
    fetching,
    getNotificationData,
    setuser
  })
)(SubscriberList);
