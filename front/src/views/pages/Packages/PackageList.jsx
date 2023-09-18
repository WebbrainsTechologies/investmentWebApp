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
  userApprovedRejectdSubscription
} from "services/userSubscriptionServices";
import moment from "moment";
import Updateutr from "./Updateutr";
import ViewPackageModal from "./ViewPackageModal";

// import { SubscriptionAllDetails } from "services/subscriptionServices";

const { success, error, fetching, getNotificationData } = NavigationActions;
const { setuser } = AuthActions;
let debounceTimer;

const PackageList = props => {
  const { token, success, error, sidebarTheme, getNotificationData } = props;
  const [isOpen, setOpenModal] = useState();
  // const [isEdit, setIsEdit] = useState(false);
  // const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState({});
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
  const [subscriptionData, setSubscriptionData] = useState({
    localSubscriptionId: "",
    orderId: ""
  });
  const [viewModal, setViewModal] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("");
  // const [statusModalOpen, setStatusModalOpen] = useState(false);
  // const [selectedId, setSelectedId] = useState("");
  // const [userId, setUserId] = useState("");
  // const [notificationId, setNotificationId] = useState("");
  // const updateStatus = async () => {
  //   fetching();
  //   console.log(statusModalOpen, "checkmodal");
  //   await changeSubscriberSubscriptionStatus(token, selectedId, {
  //     status: selectedValue,
  //     userId: userId,
  //     notificationId: notificationId
  //   }).then(data => {
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
        Cell: tableInstance => <span>{tableInstance.row.original.name}</span>
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
          <span>{tableInstance.row.original.currency}</span>
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
        Cell: tableInstance => <span>{tableInstance.row.original.amount}</span>
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
            {tableInstance.row.original.duration}{" "}
            {tableInstance.row.original.duration === 1 ? "Month" : "Months"}
          </span>
        )
      },
      // {
      //   Header: (tableInstance) => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Commision"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "commision",
      //   disableFilters: true,
      //   accessor: "commision",
      //   Cell: (tableInstance) => (
      //     <span>{tableInstance.row.original.commision}%</span>
      //   ),
      // },
      // {
      //   Header: (tableInstance) => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Principal Withdrawal"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "principal_withdrawal",
      //   disableFilters: true,
      //   accessor: "principal_withdrawal",
      //   Cell: (tableInstance) => (
      //     <span>{tableInstance.row.original.principal_withdrawal}%</span>
      //   ),
      // },
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
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Expiry Date"
            />
          );
        },
        placeholder: "Expirydate",
        // disableFilters: true,
        accessor: "package_expiry_date",
        Cell: tableInstance => (
          <span>
            {moment(tableInstance.row.values.package_expiry_date).format(
              "DD/MM/YYYY"
            )}
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
            {
              <div
                className={
                  tableInstance.row.values?.usersubscriptionstatus ===
                  "Accepted"
                    ? "status-active"
                    : "status-inactive"
                }
              >
                {tableInstance.row.values?.usersubscriptionstatus}
              </div>
            }
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="UTR"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "UTR",
        disableFilters: true,
        disableSortBy: true,
        accessor: "investment_type",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.original?.investment_type === "with_one_meta" &&
            tableInstance.row.original?.usersubscriptionstatus === "Pending" ? (
              <button
                className="btn btn-blue"
                onClick={() => {
                  setSubscriptionData({
                    localSubscriptionId: tableInstance.row.original?._id,
                    orderId: tableInstance.row.original?.onmeta_orderId
                  });
                  setOpenModal(true);
                }}
              >
                Utr update
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
                  setViewData(tableInstance.row.original);
                  setViewModal(true);
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
          : "desc"
    };
    // console.log(data, "check229");
    setloader(true);
    await userApprovedRejectdSubscription(token, data)
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
            Packages
          </h4>
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
              confirmText={"Status"}
              message={`Are you sure you want to ${selectedValue} subscription?`}
              handleConfirm={() => updateStatus()}
            />
          )}
        </Modal> */}
        {/* <Modal isOpen={openDeleteModal} backdrop={true}>
          {openDeleteModal && (
            <ConformationModaluser
              isOpen={openDeleteModal}
              onClose={() => toggleDeleteModalOpen(false)}
              confirmText={"Delete"}
              message={"Are you sure you want to  delete Subscription ?"}
              handleConfirm={() => deleteClick()}
            />
          )}
        </Modal> */}
        <Modal isOpen={isOpen} backdrop={true} centered>
          <Updateutr
            onclose={() => {
              setOpenModal(false);
              setSubscriptionData({
                localSubscriptionId: "",
                orderId: ""
              });
              toggleRefresh(true);
            }}
            localSubscriptionId={subscriptionData.localSubscriptionId}
            orderId={subscriptionData.orderId}
          />
        </Modal>
        <Modal isOpen={viewModal} backdrop={true} centered>
          <ViewPackageModal
            onClose={() => {
              setViewModal(false);
              setViewData({});
            }}
            viewData={viewData}
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
)(PackageList);
