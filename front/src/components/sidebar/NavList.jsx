import React, { Fragment, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Collapse, CardBody, Card } from "reactstrap";
import NavSecondChild from "components/sidebar/NavSecondChild";
// import IntlMessages from "util/intlMessages";
import classNames from "classnames";

const NavList = props => {
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (props.list.child) {
      const finalList = props.list.child.filter(
        a => !a.hasOwnProperty("child")
      );
      const threeList = props.list.child.filter(a => a.hasOwnProperty("child"));
      const finalThreelevel = [];
      if (threeList.length) {
        threeList.forEach(element => {
          element.child.forEach(ele => {
            finalThreelevel.push(ele.routepath);
          });
        });
      }
      if (
        (finalList.length &&
          finalList.map(a => a.routepath).includes(props.location.pathname)) ||
        (finalThreelevel && finalThreelevel.includes(props.location.pathname))
      ) {
        setCollapse(true);
      }
    }
  }, [props.list.child, props.location.pathname]);

  const toggle = e => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  let dynamicList;
  const {
    listNameStyle,
    list,
    mini,
    miniDrawerWidth,
    drawerWidth,
    location
  } = props;
  const CurrentRoute = location.pathname;

  if (list.child) {
    const finalList = list.child.filter(a => !a.hasOwnProperty("child"));
    const threeList = list.child.filter(a => a.hasOwnProperty("child"));
    const finalThreelevel = [];
    if (threeList.length) {
      threeList.forEach(element => {
        element.child.forEach(ele => {
          finalThreelevel.push(ele.routepath);
        });
      });
    }
    dynamicList = (
      <li
        className={classNames("pos-relative", collapse && "sidebar-whole-list")}
      >
        {!mini || miniDrawerWidth === drawerWidth ? (
          collapse ? (
            <i
              className={classNames(
                ((finalList.length &&
                  finalList.map(a => a.routepath).includes(CurrentRoute)) ||
                  (finalThreelevel &&
                    finalThreelevel.includes(CurrentRoute))) &&
                  "active-arrows",
                "fas fa-caret-up",
                "arrow-sidebar"
              )}
              onClick={toggle}
            />
          ) : (
            <i
              className={classNames(
                ((finalList.length &&
                  finalList.map(a => a.routepath).includes(CurrentRoute)) ||
                  (finalThreelevel &&
                    finalThreelevel.includes(CurrentRoute))) &&
                  "active-arrows",
                "fas fa-caret-down",
                "arrow-sidebar"
              )}
              onClick={toggle}
            />
          )
        ) : (
          ""
        )}
        <NavLink
          to={"/demo"}
          onClick={toggle}
          className={classNames(
            ((finalList.length &&
              finalList.map(a => a.routepath).includes(CurrentRoute)) ||
              (finalThreelevel && finalThreelevel.includes(CurrentRoute))) &&
              "active",
            "nav-link",
            "main-list"
          )}
        >
          <i className={list.iconClass} />
          <p style={listNameStyle}>
            {/* {<IntlMessages id= />} */}
            {list.name}
            {list.hasOwnProperty("isNew") && list["isNew"] && (
              <span
                style={{ right: "23px" }}
                className="new-update-tag fs-13 bold-text"
              >
                New
              </span>
            )}
          </p>
        </NavLink>
        <Collapse isOpen={collapse}>
          <Card className="background-transparent border-none">
            <CardBody
              className={classNames(
                "pa-0",
                props.themeSetting.activeLinkStyle === "style4" &&
                  "active-sidebar-type-class"
              )}
            >
              {list.child
                ? list.child.map((childList, i) => {
                    return (
                      <Fragment key={i}>
                        {childList.child ? (
                          <NavSecondChild
                            CurrentRoute={CurrentRoute}
                            listNameStyle={listNameStyle}
                            childList={childList}
                            mini={mini}
                            miniDrawerWidth={miniDrawerWidth}
                            drawerWidth={drawerWidth}
                          />
                        ) : (
                          <NavLink
                            to={childList.routepath}
                            className="nav-link child-list"
                            key={i}
                          >
                            <span className="span-shortname">
                              {childList.shortname}
                            </span>
                            <p style={listNameStyle}>
                              {/* {<IntlMessages id= />} */}
                              {childList.listname}
                              {childList.hasOwnProperty("isNew") &&
                                childList["isNew"] && (
                                  <span className="new-update-tag fs-13 bold-text">
                                    New
                                  </span>
                                )}
                            </p>
                          </NavLink>
                        )}
                      </Fragment>
                    );
                  })
                : ""}
            </CardBody>
          </Card>
        </Collapse>
      </li>
    );
  } else {
    dynamicList = (
      <li>
        <NavLink to={list.routepath} className="nav-link main-list">
          <i className={list.iconClass} />
          <p style={listNameStyle}>
            {/* {<IntlMessages id= />} */}
            {list.name}
            {list.hasOwnProperty("isNew") && list["isNew"] && (
              <span className="new-update-tag fs-13 bold-text">New</span>
            )}
          </p>
        </NavLink>
      </li>
    );
  }

  return <Fragment>{dynamicList}</Fragment>;
};

export default NavList;
