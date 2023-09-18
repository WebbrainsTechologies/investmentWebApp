import { connect } from "react-redux";
// import PageTitle from 'components/common/PageTitle';
import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { rowData } from "util/data/reactTableData";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
// import Pagination from "@mui/material/Pagination";
import classnames from "classnames";
import Pagination from "components/common/Pagination";
import ReactTableWrapper from "../../../components/reacttable/reacttbl.style";
// import enhancer from "./enhancer/ServiceEnhancer";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import {
  deleteUser,
  userStatusUpdate,
  userlist
} from "services/userProfileServices";
import { Modal } from "reactstrap";
import UserAddEditModal from "./userAddEditModal";
import ConformationModaluser from "components/common/ConformationModalUser";
import { Edit3, Eye, Trash2 } from "react-feather";
import { withRouter } from "react-router-dom";
import ChangeuserStatus from "./ChangeuserStatus";
import Deleteuser from "./Deleteuser";

const HeaderComponent = props => {
  let classes = {
    "my-2": true,
    "mx-2": true,
    "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
    "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
  };
  return <div className={classnames(classes)}>{props.title}</div>;
};

const { success, error, fetching } = NavigationActions;

const UserList = props => {
  const { sidebarTheme, token, history } = props;
  // console.log(token, "token")
  const activeColor = {
    color: sidebarTheme.activeColor
  };
  const [sortObject, setSortObject] = useState({ id: "createdAt", desc: true });
  const [totalRecords, setTotalRecords] = useState("0");
  const [dataLength, setDataLength] = useState(0);
  const [isOpen, setOpenModal] = useState();
  const [refresh, toggleRefresh] = useState(true);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLength, setPageLength] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteID] = useState("");
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);

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
    await userStatusUpdate(token, data.id, {
      user_status: data.status
    }).then(data => {
      if (data.success) {
        success(data.message);
        toggleRefresh(true);
      } else {
        error(data.message);
      }
    });
  };

  const columns = useMemo(
    () => [
      // {
      //   Header: tableInstance => {
      //     return (
      //       <HeaderComponent
      //         isSortedDesc={tableInstance.column.isSortedDesc}
      //         title="Image"
      //       />
      //     );
      //   },
      //   // Filter: FilterComponent,
      //   placeholder: "image",
      //   accessor: "image",
      //   Cell: tableInstance => (
      //     <span>
      //       <img
      //         src={`${process.env.REACT_APP_UPLOAD_DIR}${tableInstance.row.original?.file_image}`}
      //         className="profile-img"
      //         alt="no"
      //         width={60}
      //       />
      //     </span>
      //   )
      // },
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
              title="Name"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Names",
        accessor: "name",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.original?.name}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Email"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "Email",
        accessor: "email",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.original?.email}
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
        accessor: "is_delete",
        Cell: tableInstance => (
          <span>
            <div
              className={
                !tableInstance.row.original?.is_delete
                  ? "status-active"
                  : "status-inactive"
              }
              onClick={() => {
                // setSelectedId(tableInstance.row.original._id);
                // setSelectedStatus(
                //   tableInstance.row.values?.user_status === false ? true : false
                // );
                // setStatusModalOpen(true);

                toggleDeleteModalOpen(true);
                setDeleteID(tableInstance.row.original?._id);
                setUserName(tableInstance.row.original?.name);
                // setConfirmProps({
                //   isOpen: true,
                //   confirmText: "Change",
                //   confirmMessage: `Are you sure to change status ?`,
                //   confirmFunc: () =>
                //     updateStatus({
                //       id: tableInstance.row.original._id,
                //       status:
                //         tableInstance.row.values?.user_status === false
                //           ? true
                //           : false,
                //     }),
                // });
              }}
            >
              {tableInstance.row.original?.user_status ? "Active" : "Inactive"}
            </div>
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Phone Number"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "phone number",
        accessor: "phone_number",
        Cell: tableInstance => (
          <span className="text-capitalize">
            {tableInstance.row.original?.phone_number}
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
        accessor: "id",
        disableSortBy: true,
        disableFilters: true,
        Cell: tableInstance => {
          return (
            <div className="react-action-class">
              <button
                className="table-action action-view"
                onClick={() => {
                  // setEditData(tableInstance.row.original);
                  // setIsView(true);
                  // setOpenModal(true);
                  history.push(
                    `/userdetail/${tableInstance.row.original?._id}`
                  );
                }}
              >
                <Eye className="table-icon-edit" />
              </button>
              <button
                className="table-action action-edit"
                onClick={() => {
                  setOpenModal(true);
                  setIsEdit(true);
                  setEditData(tableInstance.row.original);
                }}
              >
                {/* <i className="fas fa-edit" /> */}
                <Edit3 className="table-icon-edit" />
              </button>
              {/* <button
                className="action-delete"
                onClick={() => {
                  toggleDeleteModalOpen(true);
                  setDeleteID(tableInstance.row.original?._id);
                  setUserName(tableInstance.row.original?.name);
                }}
              >
                <Trash2 />
              </button> */}
            </div>
          );
        }
      }
    ],
    [userList]
  );

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    headerGroups,
    rows,
    state: { sortBy }
  } = useTable(
    {
      data: userList,
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

  const getUserHandler = useCallback(async () => {
    setLoading(true);
    const data = {
      limit: 10,
      page: currentPage + 1,
      search: search === undefined ? "" : search,
      sort_on: sortObject.id ? sortObject.id : "createdAt",
      sort:
        sortObject.desc !== undefined
          ? sortObject.desc
            ? "desc"
            : "asc"
          : "desc"
    };
    await userlist(token, data)
      .then(res => {
        // console.log(res, "check72");
        setUserList(res.data.docs);
        setDataLength(res.data?.docs?.length);
        setTotalRecords(res.data?.totalDocs);
        setTotalPage(res.data?.totalPages);
        toggleRefresh(false);
        setLoading(false);
      })
      .catch(err => {
        error(err.message);
        setLoading(false);
      });
    //eslint-disable-next-line
  }, [currentPage, sortObject, search]);

  useEffect(() => {
    refresh && getUserHandler();
  }, [refresh]);

  // useEffect(() => {
  //   getUserHandler();
  // }, [pageCng, search, show]);
  useEffect(() => {
    // Call api here
    setCurrentPage(0);
    toggleRefresh(true);
  }, [sortObject, pageLength]);

  useEffect(() => {
    setSortObject({ ...sortBy[0] });
    toggleRefresh(true);
  }, [sortBy]);

  useEffect(() => {
    if (search !== undefined) {
      const timeOutId = setTimeout(() => getUserHandler(), 1000);
      return () => clearTimeout(timeOutId);
    }
    //eslint-disable-next-line
  }, [search]);
  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
    toggleRefresh(true);
  };

  const deleteClick = async () => {
    setLoading(true);
    await deleteUser(token, deleteId).then(res => {
      if (res.success) {
        success(res.message);
        // setPageCng(
        //   dataLength === 1 ? (pageCng !== 1 ? pageCng - 1 : pageCng) : pageCng
        // );
        setCurrentPage(
          dataLength === 1
            ? currentPage !== 0
              ? currentPage - 1
              : currentPage
            : currentPage
        );
        toggleRefresh(true);
        toggleDeleteModalOpen(false);
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };

  return (
    <>
      <div>
        {/* <PageTitle title="sidebar.Countries" /> */}
        <div>
          <div className="theme-color">
            <div className="row justify-content-between align-items-center mb-3">
              <div className="col">
                <h4 className="page-title" style={activeColor}>
                  Users
                </h4>
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-blue"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Add User
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                {
                  <ReactTableWrapper {...props}>
                    <div className="table-container text-left overflow-auto">
                      <table
                        border={1}
                        className="custom-react-table-theme-class"
                        {...getTableProps()}
                      >
                        <thead>
                          {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                              {headerGroup.headers.map(header => (
                                <th
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
                        {loading ? (
                          <tbody>
                            <tr>
                              <td>
                                <Loader />
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          <tbody {...getTableBodyProps()}>
                            {/* {headerGroups.map(headerGroup => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map(header => {
                                            return (
                                                <td
                                                    {...header.getHeaderProps(
                                                        header.getSortByToggleProps()
                                                    )}
                                                >
                                                    <div>
                                                        {header.canFilter ? header.render("Filter") : null}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))} */}
                            {userList.length > 0 ? (
                              rows.map(row => {
                                prepareRow(row);
                                return (
                                  <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                      <td {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                {
                                  <td
                                    className="mt-4 text-center font-weight-bold"
                                    colSpan={6}
                                  >
                                    <h5>No data found</h5>
                                  </td>
                                }
                              </tr>
                            )}
                          </tbody>
                        )}
                      </table>
                    </div>
                    <div className="float-right">
                      <Pagination
                        onPageChange={handlePageChange}
                        pages={totalPage}
                        page={currentPage}
                      />
                    </div>
                  </ReactTableWrapper>
                }
              </div>
            </div>

            {/* <Modal isOpen={openDeleteModal} backdrop={true}>
              {openDeleteModal && (
                <ConformationModaluser
                  isOpen={openDeleteModal}
                  onClose={() => toggleDeleteModalOpen(false)}
                  confirmText={"Delete"}
                  message={`Are you sure you want to  delete ${userName} profile?`}
                  handleConfirm={() => deleteClick()}
                />
              )}
            </Modal> */}
            <Modal isOpen={isOpen} backdrop={true} className="modal-lg">
              {isOpen && (
                <UserAddEditModal
                  onClose={() => {
                    setOpenModal(false);
                    setIsEdit(false);
                    setEditData({});
                    setIsView(false);
                  }}
                  isView={isView}
                  isEdit={isEdit}
                  editData={editData}
                  toggleRefresh={e => toggleRefresh(e)}
                />
              )}
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
            <Modal isOpen={statusModalOpen} backdrop={true} centered>
              <ChangeuserStatus
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
            <Modal isOpen={openDeleteModal} backdrop={true} centered>
              <Deleteuser
                isOpen={openDeleteModal}
                onClose={() => {
                  toggleDeleteModalOpen(false);
                  setDeleteID("");
                  setCurrentPage(
                    dataLength === 1
                      ? currentPage !== 0
                        ? currentPage - 1
                        : currentPage
                      : currentPage
                  );
                  toggleRefresh(!refresh);
                }}
                deleteId={deleteId}
                userName={userName}
              />
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

// const FilterComponent = tableInstance => {
//     const { filterValue, setFilter } = tableInstance.column;
//     return (
//         <input
//             type="text"
//             value={filterValue || ""}
//             onChange={e => {
//                 setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
//             }}
//             className="tabl-search react-form-input"
//             placeholder={`Search ${tableInstance.column.placeholder}`}
//             onClick={e => e.stopPropagation()}
//         />
//     );
// };

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching })
)(UserList);
