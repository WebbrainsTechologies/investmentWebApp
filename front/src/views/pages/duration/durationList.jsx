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
import { Edit3, Trash2 } from "react-feather";
import Loader from "components/Loader";
import moment from "moment";
import ConformationModaluser from "components/common/ConformationModalUser";
import DurationAddEdit from "./durationAddEdit";
import {
  changeDurationStatus,
  deleteDuration,
  getDurationList
} from "services/durationServices";
import ChangedurationStatus from "./ChangedurationStatus";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;
let debounceTimer;

const DurationList = props => {
  const { token, success, error, sidebarTheme } = props;
  const [isOpen, setOpenModal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [refresh, toggleRefresh] = useState(false);
  const [durationList, setDurationList] = useState([]);
  const [sortObject, setSortObject] = useState({ id: "createdAt", desc: true });
  const [selectedId, setSelectedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [openDeleteModal, toggleDeleteModalOpen] = useState();
  const [totalRecords, setTotalRecords] = useState("0");
  const [dataLength, setDataLength] = useState(0);

  //eslint-disable-next-line
  const [deleteId, setDeleteID] = useState("");
  const [loader, setloader] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
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

  const updateStatus = async data => {
    fetching();
    closeConfrimModal();
    // console.log(data, "check");
    await changeDurationStatus(token, data.id, {
      status: data.status
    }).then(data => {
      if (data.success) {
        success(data.message);
        toggleRefresh(true);
      } else {
        error(data.message);
      }
    });
  };

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
              title="Duration Month"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Duration Month",
        disableFilters: true,
        accessor: "month",
        Cell: tableInstance => (
          <span>
            {tableInstance.row.values.month === 1
              ? `${tableInstance.row.values.month} Month`
              : `${tableInstance.row.values.month} Months`}
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
        accessor: "status",
        Cell: tableInstance => (
          <span>
            <div
              className={
                tableInstance.row.values?.status
                  ? "status-active"
                  : "status-inactive"
              }
              onClick={() => {
                setSelectedId(tableInstance.row.original._id);
                setSelectedStatus(
                  tableInstance.row.values?.status === false ? true : false
                );
                setStatusModalOpen(true);
                // setConfirmProps({
                //   isOpen: true,
                //   confirmText: "Change",
                //   confirmMessage: `Are you sure to change status ?`,
                //   confirmFunc: () =>
                //     updateStatus({
                //       id: tableInstance.row.original._id,
                //       status:
                //         tableInstance.row.values?.status === false
                //           ? true
                //           : false,
                //     }),
                // });
              }}
            >
              {tableInstance.row.values?.status ? "Active" : "Inactive"}
            </div>
          </span>
        )
      },
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
      //     </span>
      //   )
      // },
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
                className="table-action action-edit"
                onClick={() => {
                  // console.log(
                  //   "clicked",
                  //   durationList,
                  //   tableInstance.row.values
                  // );
                  setEditData(tableInstance.row.original);
                  setIsEdit(true);
                  setOpenModal(true);
                }}
              >
                <Edit3 className="table-icon-edit" />
              </button>
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
    [durationList]
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
      data: durationList,
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
    await getDurationList(token, data)
      .then(res => {
        // console.log(res.data, "check72");
        setDurationList(res.data?.docs);
        setDataLength(res.data?.docs?.length);
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
  const deleteClick = async () => {
    setloader(true);
    await deleteDuration(token, deleteId).then(res => {
      // console.log(res, "item to delete");
      if (res.success) {
        success(res.message);
        // setPageCng(
        //   dataLength === 1 ? (pageCng !== 1 ? pageCng - 1 : pageCng) : pageCng
        // );
        setCurrentPage(currentPage !== 0 ? currentPage - 1 : currentPage);
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
        setloader(false);
      } else {
        error(res.message);
        setloader(false);
      }
    });
  };
  return (
    <>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col">
          <h4 className="page-title" style={activeColor}>
            Duration
          </h4>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-blue"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Add Duration
          </button>
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
        {/* )} */}

        <Modal isOpen={isOpen} backdrop={true}>
          {isOpen && (
            <DurationAddEdit
              onClose={() => {
                setOpenModal(false);
                setIsEdit(false);
                setEditData({});
              }}
              isEdit={isEdit}
              editData={editData}
              toggleRefresh={e => toggleRefresh(e)}
            />
          )}
        </Modal>
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
        <Modal isOpen={statusModalOpen} backdrop={true} centered>
          <ChangedurationStatus
            isOpen={statusModalOpen}
            onClose={() => {
              setStatusModalOpen(false);
              setSelectedId("");
              setSelectedStatus("");
              toggleRefresh(!refresh);
            }}
            selectedId={selectedId}
            selectedStatus={selectedStatus}
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
    user: state.auth.user
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(DurationList);
