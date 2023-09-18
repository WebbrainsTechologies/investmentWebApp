import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import ReactTableWrapper from "components/reacttable/reacttbl.style";
import classNames from "classnames";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import Loader from "components/Loader";
import moment from "moment";
import { Progress } from "reactstrap";

const { success, error, fetching } = NavigationActions;
const { setuser, loader } = AuthActions;

const Futurepaymentusertable = props => {
  const { futurepaymentData } = props;
  const HeaderComponent = props => {
    let classes = {
      "-sort-asc": props.isSortedDesc !== undefined && !props.isSortedDesc,
      "-sort-desc": props.isSortedDesc !== undefined && props.isSortedDesc
    };
    return <div className={classNames(classes)}>{props.title}</div>;
  };
  const columns = useMemo(
    () => [
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="Date"
            />
          );
        },
        placeholder: "date",
        disableFilters: true,
        disableSortBy: true,
        accessor: "roi_date",
        Cell: tableInstance => (
          <span>
            {moment(tableInstance.row.values?.roi_date).format("DD/MM/YYYY")}
          </span>
        )
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="state"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "state",
        disableSortBy: true,
        disableFilters: true,
        accessor: "_id",
        Cell: tableInstance => (
          <span>
            <Progress
              color="warning"
              value={tableInstance.row.original?.progress}
            />
          </span>
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
        placeholder: "amount",
        disableFilters: true,
        disableSortBy: true,
        accessor: "roi",
        Cell: tableInstance => <span>{tableInstance.row.values.roi}</span>
      },
      {
        Header: tableInstance => {
          return (
            <HeaderComponent
              isSortedDesc={tableInstance.column.isSortedDesc}
              title="status"
            />
          );
        },
        // Filter: FilterComponent,
        placeholder: "status",
        disableFilters: true,
        disableSortBy: true,
        accessor: "__id",
        Cell: tableInstance => (
          <span
            className={
              tableInstance.row.original?.progress >= 100
                ? "status-active received"
                : "status-inactive"
            }
          >
            {tableInstance.row.original?.progress >= 100
              ? "Received"
              : "Pending"}
            {/* {moment(new Date()).unix() >
            moment(tableInstance.row.orignal?.roi_date).unix()
              ? "Received"
              : "pending"} */}
          </span>
        )
      }
    ],
    // eslint-disable-next-line
    [futurepaymentData]
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
      data: futurepaymentData,
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
  // console.log(futurepaymentData, "check129");
  return (
    <>
      <div className="package-table-main">
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
                            <td className="td-border" {...cell.getCellProps()}>
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
        {/* )} */}
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
)(Futurepaymentusertable);
