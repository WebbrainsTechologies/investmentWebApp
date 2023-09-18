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
import Loader from "components/Loader";
import { getAllKyc } from "services/kycServices";
import { Edit3, Eye } from "react-feather";
import { getInvoiceList } from "services/invoiceServices";
import moment from "moment";

// import { SubscriptionAllDetails } from "services/subscriptionServices";

const { success, error, fetching, getNotificationData } = NavigationActions;
const { setuser } = AuthActions;
let debounceTimer;

const Invoice = props => {
  const { token, success, error, sidebarTheme, history } = props;
  const [refresh, toggleRefresh] = useState(false);
  const [packageList, setPackageList] = useState([]);
  const [sortObject, setSortObject] = useState({
    id: "invoice_number",
    desc: true
  });
  // const [openDeleteModal, toggleDeleteModalOpen] = useState();
  const [totalRecords, setTotalRecords] = useState("0");
  // const [dataLength, setDataLength] = useState(0);

  //eslint-disable-next-line
  const [deleteId, setDeleteID] = useState("");
  const [loader, setloader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [isOpen, setOpenModal] = useState(false);

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
              title="Invoice Number"
            />
          );
        },
        placeholder: "Invoice Number",
        // disableFilters: true,
        accessor: "invoice_number",
        Cell: tableInstance => (
          <span>{tableInstance.row.original?.invoice_number}</span>
        )
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
        accessor: "userDetails.name",
        Cell: tableInstance => (
          <span>{tableInstance.row.original.userDetails?.name}</span>
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
        accessor: "userSubscriptionDetails.amount",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.original?.userSubscriptionDetails?.amount?.toFixed(
              2
            )}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Generated Date"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Generated Date",
        // disableFilters: true,
        // disableSortBy: true,
        accessor: "createdAt",
        Cell: tableInstance => (
          <span>
            {moment(tableInstance.row.original?.createdAt).format("DD/MM/YYYY")}
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
              {/* <button
                className="table-action action-view"
                onClick={() => {
                  setEditData(tableInstance.row.original);
                  setIsView(true);
                  setOpenModal(true);
                }}
              >
                <Eye className="table-icon-edit" />
              </button> */}
              {/* {tableInstance.row.original?.status === "Pending" ? ( */}
              <button
                className="table-action action-view"
                // onClick={() => {
                //   // setEditData(tableInstance.row.original);
                //   // setIsEdit(true);
                //   // setOpenModal(true);
                //   history.push(
                //     `kycdetail/${tableInstance.row.original?.userData?._id}`
                //   );
                // }}
              >
                <a
                  href={`${process.env.REACT_APP_INVOICE_UPLOAD_DIR}${tableInstance.row.original?.invoice_name}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#efbe75" }}
                >
                  <Eye className="table-icon-edit" />
                </a>
              </button>
              {/* <button
                className="table-action action-edit"
                // onClick={() => {
                //   // setEditData(tableInstance.row.original);
                //   // setIsEdit(true);
                //   // setOpenModal(true);
                //   history.push(
                //     `kycdetail/${tableInstance.row.original?.userData?._id}`
                //   );
                // }}
              >
                <a
                  href={`${process.env.REACT_APP_INVOICE_UPLOAD_DIR}${tableInstance.row.original?.invoice_name}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="table-icon-edit"
                >
                  <Eye className="table-icon-edit" />
                </a>
              </button> */}
              {/* ) : (
                <>-</>
              )} */}
            </div>
          );
        }
      }
      // {
      //   Header: (tableInstance) => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Status"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "Status",
      //   disableFilters: true,
      //   disableSortBy: true,
      //   accessor: "status",
      //   Cell: (tableInstance) => (
      //     <span>
      //       {tableInstance.row.values?.status === "Pending" ? (
      //         <select
      //           name="status"
      //           id="status"
      //           defaultValue={""}
      //           onChange={(e) => {
      //             setApiData({
      //               userId: tableInstance.row.original?.userData?._id,
      //               name: tableInstance.row.original?.userData?.name,
      //               status: e.target.value,
      //             });
      //             setSelectedId(tableInstance.row.original?._id);
      //             setStatusModalOpen(true);
      //           }}
      //           className="custom-select"
      //         >
      //           <option value={""} hidden>
      //             Pending
      //           </option>
      //           <option value={"Accepted"}>Accept</option>
      //           <option value={"Rejected"}>Reject</option>
      //         </select>
      //       ) : (
      //         <div
      //           className={
      //             tableInstance.row.values?.status === "Accepted"
      //               ? "status-active"
      //               : "status-inactive"
      //           }
      //         >
      //           {tableInstance.row.values?.status}
      //         </div>
      //       )}
      //     </span>
      //   ),
      // },
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
      sort_on: sortObject.id ? sortObject.id : "invoice_number",
      sort:
        sortObject.desc !== undefined
          ? sortObject.desc
            ? "desc"
            : "asc"
          : "desc"
    };
    setloader(true);
    await getInvoiceList(token, data)
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
    setCurrentPage(0);
    toggleRefresh(true);
  }, [sortBy]);

  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
    toggleRefresh(true);
  };
  return (
    <>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col">
          <h4 className="page-title" style={activeColor}>
            Invoices
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
        {/* <Modal isOpen={isOpen} backdrop={true} className="modal-lg">
          {isOpen && (
            <AdminkycEdit
              onClose={() => {
                setOpenModal(false);
                setIsEdit(false);
                setEditData({});
              }}
              isEdit={isEdit}
              editData={editData}
              toggleRefresh={(e) => toggleRefresh(e)}
            />
          )}
        </Modal> */}
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
)(Invoice);
