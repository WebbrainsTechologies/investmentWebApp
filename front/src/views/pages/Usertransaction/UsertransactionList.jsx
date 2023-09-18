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
import { deleteSubscription } from "services/subscriptionServices";
import ConformationModaluser from "components/common/ConformationModalUser";
import {
  changeSubscriberSubscriptionStatus,
  getSubscriberSubscription,
  getUserTransectionList
} from "services/userSubscriptionServices";
import moment from "moment";
import { getUserWalletData } from "services/userWalletServices";
import { walletWithdrawalrequestforuser } from "services/withdrawalServices";
import UserWithdrawalRequestDetails from "./UserWithdrawalRequestDetails";
import UpdateHash from "./UpdateHash";

// import { SubscriptionAllDetails } from "services/subscriptionServices";

const { success, error, fetching, getNotificationData } = NavigationActions;
const { setuser } = AuthActions;
let debounceTimer;

const UserTransactionList = props => {
  const { token, success, error, sidebarTheme, getNotificationData } = props;
  const [isOpen, setOpenModal] = useState(false);
  const [hashModal, setHashModal] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
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
  const [userId, setUserId] = useState("");
  const [notificationId, setNotificationId] = useState("");
  const [withdrawalData, setWithdrawalData] = useState({
    localSubscriptionId: "",
    orderId: ""
  });
  // const updateStatus = async () => {
  //   fetching();
  //   console.log(statusModalOpen, "checkmodal");
  //   await changeSubscriberSubscriptionStatus(token, selectedId, {
  //     status: selectedValue,
  //     userId: userId,
  //     notificationId: notificationId,
  //   }).then((data) => {
  //     if (data.success) {
  //       success(data.message);
  //       setSelectedValue("");
  //       setSelectedId("");
  //       setUserId("");
  //       setNotificationId("");
  //       setStatusModalOpen(false);
  //       getNotificationData(token);
  //       toggleRefresh(true);
  //     } else {
  //       error(data.message);
  //       setSelectedValue("");
  //       setUserId("");
  //       setNotificationId("");
  //       setStatusModalOpen(false);
  //       setSelectedId("");
  //     }
  //   });
  // };

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
      // {
      //   Header: (tableInstance) => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Subscription Name"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "Subscription Name",
      //   disableFilters: true,
      //   accessor: "subscription.name",
      //   Cell: (tableInstance) => (
      //     <span>{tableInstance.row.original.subscription?.name}</span>
      //   ),
      // },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Transaction Date"
            />
          );
        },
        placeholder: "Transaction Date",
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
        accessor: "currencyId",
        Cell: tableInstance => (
          <span>{tableInstance.row.original.currencyId?.name}</span>
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
          <span>{tableInstance.row.values?.amount?.toFixed(2)}</span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Wallet Address"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Wallet Address",
        disableFilters: true,
        disableSortBy: true,
        accessor: "walletAddress",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.values?.walletAddress
              ? tableInstance.row.values?.walletAddress
              : "-"}
          </span>
        )
      },
      // {
      //   Header: (tableInstance) => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Duration"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "Duration",
      //   disableFilters: true,
      //   accessor: "userSubscriptionId.duration",
      //   Cell: (tableInstance) => (
      //     <span>
      //       {tableInstance.row.original.userSubscriptionId?.duration === 1
      //         ? `${tableInstance.row.original.userSubscriptionId?.duration} Month`
      //         : `${tableInstance.row.original.userSubscriptionId?.duration} Months`}
      //     </span>
      //   ),
      // },
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
        accessor: "status",
        Cell: tableInstance => (
          // <span>
          //   {tableInstance.row.values?.is_withdraw === false
          //     ? "Credit"
          //     : "Debit"}
          // </span>
          <div
            className={
              tableInstance.row.values?.status === "Accepted"
                ? "status-active"
                : "status-inactive"
            }
          >
            {tableInstance.row.values?.status}
          </div>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Hash"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Hash",
        disableFilters: true,
        disableSortBy: true,
        accessor: "hash_value",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.original?.withdrawal_type === "with_one_meta" &&
            tableInstance.row.original?.hash_value === "" ? (
              <button
                className="btn btn-blue"
                onClick={() => {
                  setWithdrawalData({
                    localSubscriptionId: tableInstance.row.original?._id,
                    orderId: tableInstance.row.original?.withdrawal_orderId
                  });
                  setHashModal(true);
                }}
              >
                Hash update
              </button>
            ) : (
              <>-</>
            )}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Action"
            />
          );
        },

        accessor: "_id",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          return (
            <div className="react-action-class">
              <button
                className="table-action action-view"
                onClick={() => {
                  setEditData(tableInstance.row.original);
                  setIsView(true);
                  setOpenModal(true);
                }}
              >
                <Eye className="table-icon-edit" />
              </button>
              {/* <button
                className="table-action action-edit"
                onClick={() => {
                  setEditData(tableInstance.row.original);
                  setIsEdit(true);
                  setOpenModal(true);
                }}
              >
                <Edit3 className="table-icon-edit" />
              </button> */}
              {/* <button
                className="action-delete"
                onClick={() => {
                  toggleDeleteModalOpen(true);
                  setDeleteID(tableInstance.row.original?._id);
                }}
              >
                <Trash2 />
              </button> */}
            </div>
          );
        }
      }
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
          : "desc"
    };
    // console.log(data, "check229");
    setloader(true);
    await walletWithdrawalrequestforuser(token, data)
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
  }, [currentPage, sortObject]);

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
            Transaction
          </h4>
        </div>
      </div>
      <div>
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
        <Modal isOpen={hashModal} backdrop={true} centered>
          <UpdateHash
            onclose={() => {
              toggleRefresh(true);
              setHashModal(false);
              setWithdrawalData({
                localSubscriptionId: "",
                orderId: ""
              });
            }}
            withdrawalData={withdrawalData}
          />
        </Modal>
        <Modal isOpen={isOpen} backdrop={true} centered>
          <UserWithdrawalRequestDetails
            onClose={() => {
              setIsView(false);
              setOpenModal(false);
              setEditData({});
            }}
            editData={editData}
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
)(UserTransactionList);
