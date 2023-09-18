import React, { useState } from "react";
import HeaderWrapper from "./header.style";
import { UncontrolledPopover, PopoverBody } from "reactstrap";
import { ProfileLockScreen } from "helper/constant";
import { connect } from "react-redux";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { Link, withRouter } from "react-router-dom";
import { Bell } from "react-feather";
import moment from "moment";
import PopoverBlock from "./PopoverBlock";

const { logout, setUser } = AuthActions;

const Header = props => {
  const {
    drawerMiniMethod,
    mini,
    token,
    notificationData,
    user,
    userNotifications,
    notifications,
    getNotificationData,
    kycStatus
  } = props;
  // console.log(notificationData, "check18");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [notificationpopoverOpen, setNotificationPopoverOpen] = useState(false);
  const notificationtoggle = () =>
    setNotificationPopoverOpen(!notificationpopoverOpen);
  let unreadCount = notificationData?.unread_notifications;

  const toggle = () => {
    // console.log(popoverOpen, "checkpopoveropen");
    setPopoverOpen(!popoverOpen);
  };
  const userSignout = () => {
    props.setUser({});
    props.logout(token);
  };

  return (
    <HeaderWrapper {...props}>
      <div className="headerBack">
        <div className="flex-x align-center">
          <div className="drawer-handle-arrow">
            {mini ? (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <i className="fas fa-bars"></i>
              </button>
            ) : (
              <button
                className="top-header-icon"
                onClick={() => drawerMiniMethod()}
              >
                <i className="fas fa-bars"></i>
              </button>
            )}
          </div>
          <div
            className="mini-drawer-menu-icon"
            onClick={() => drawerMiniMethod()}
          >
            <i className="fas fa-bars" />{" "}
            <span className="app-name fs-16 bold-text">{"Secure Fintec"}</span>
          </div>
          {/* <div className="pl-10">
                        <button
                            id="mail"
                            className="top-header-icon"
                        >
                            <i className="far fa-envelope"></i>
                            <div className="button-badge fs-11 demi-bold-text">
                                3
                            </div>
                        </button>
                        <UncontrolledPopover placement="bottom-start" target="mail" className="header-popover" trigger="focus">
                            <PopoverBody className="mail-popover-body">
                                <div className="fs-13 bold-text mb-10">
                                    You have 3 mails.
                                </div>
                                <PopoverBlock
                                    people={friend1}
                                    name="Alex Woods"
                                    text="Hello, How are you ?"
                                    created="Just Now"
                                />
                                <PopoverBlock
                                    people={friend2}
                                    name="James Anderson"
                                    text="Please check your transaction"
                                    created="22nd July 2019"
                                />
                                <PopoverBlock
                                    people={friend3}
                                    name="Watson"
                                    text="You won price.."
                                    created="20th Jun 2019"
                                />
                            </PopoverBody>
                        </UncontrolledPopover>
                    </div> */}
          <div className="pl-10 flex-1">
            {/*               <button
                            id="notification"
                            className="top-header-icon"
                        >
                            <i className="far fa-bell"></i>
                            <div className="button-badge fs-11 demi-bold-text">
                                3
                            </div>
                        </button>
                        <UncontrolledPopover placement="bottom-start" target="notification" className="header-popover" trigger="focus">
                            <PopoverBody className="mail-popover-body">
                                <div className="fs-13 bold-text mb-10">
                                    You have 3 Notifications.
                                </div>
                                <PopoverBlock
                                    people={people1}
                                    name="Juli Hacks"
                                    text="Send You a message..."
                                    created="Just Now"
                                />
                                <PopoverBlock
                                    people={people2}
                                    name="Scarlet JohnSon"
                                    text="Like your status..."
                                    created="22nd July 2019"
                                />
                                <PopoverBlock
                                    people={people3}
                                    name="Andrew Hales"
                                    text="Tagged you in his status"
                                    created="20th Jun 2019"
                                />
                            </PopoverBody>
                        </UncontrolledPopover>*/}
          </div>
          {/* <div className='pl-10'>
            <button className='top-header-icon'>
              <i className='fas fa-search'></i>
            </button>
          </div> */}
          <div className="mr-10">
            <div id="notification" style={{ cursor: "pointer" }}>
              <button
                id="notification"
                className="top-header-icon"
                style={{ backgroundColor: "transparent" }}
              >
                <Bell color="#FFF" onClick={() => userNotifications()} />
                {unreadCount ? (
                  <div className="button-badge fs-11 demi-bold-text">
                    {unreadCount}
                  </div>
                ) : (
                  <></>
                )}
              </button>
            </div>
            <UncontrolledPopover
              className="header-popover"
              innerClassName="roy-inner-content"
              placement="bottom-end"
              target="notification"
              trigger="legacy"
              isOpen={notificationpopoverOpen}
              toggle={notificationtoggle}
            >
              <PopoverBody className="mail-popover-body">
                <div className="fs-13 bold-text mb-10">
                  You{" "}
                  {unreadCount === 0 ? "don't have " : `have ${unreadCount} `}
                  new Notifications.
                </div>
                <div style={{ overflow: "auto", maxHeight: "350px" }}>
                  {notifications?.length > 0 &&
                    notifications?.map((i, index) => {
                      return (
                        <PopoverBlock
                          title={i.title}
                          text={i.body}
                          created={moment(i.createdAt).format(
                            "DD-MM-YYYY hh:mm a"
                          )}
                          link={i.n_link}
                          id={i._id}
                          token={token}
                          seen={i.seen}
                          key={`notifications_${index}`}
                          getNotificationData={getNotificationData}
                          userNotifications={userNotifications}
                          setNotificationPopoverOpen={
                            setNotificationPopoverOpen
                          }
                        />
                      );
                    })}
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </div>
          <div className="pl-10">
            <div id="profile">
              <img
                className="top-header-profile-class"
                src={
                  user?.profile_img
                    ? `${process.env.REACT_APP_UPLOAD_DIR}${user.profile_img}`
                    : ProfileLockScreen
                }
                alt="notify"
              />
            </div>
            <UncontrolledPopover
              className="roy-menu"
              innerClassName="roy-inner-content"
              placement="bottom-end"
              target="profile"
              trigger="legacy"
              isOpen={popoverOpen}
              toggle={toggle}
            >
              <PopoverBody>
                {user && !user?.is_superadmin && (
                  <div
                    className={
                      kycStatus === true
                        ? "roy-menu-list text-success"
                        : "roy-menu-list text-danger"
                    }
                    onClick={() => {
                      toggle();
                      props.history.push("/userkyc");
                    }}
                  >
                    Kyc : {`${kycStatus === true ? "Verified" : "Unverified"}`}
                  </div>
                )}
                {user && !user?.is_superadmin && (
                  <div
                    className="roy-menu-list"
                    onClick={() => {
                      toggle();
                      props.history.push("/linkbankaccount");
                    }}
                  >
                    Bank Account
                  </div>
                )}
                <div
                  className="roy-menu-list"
                  onClick={() => {
                    toggle();
                    props.history.push("/change-password");
                  }}
                >
                  Change Password
                </div>
                <div className="roy-menu-list" onClick={userSignout}>
                  Logout
                </div>
              </PopoverBody>
            </UncontrolledPopover>
          </div>
          {/* <div className='pl-10'>
            <button
              onClick={layoutSettingDrawerToggle}
              className='top-header-icon'
            >
              <i className='fas fa-th-large'></i>
            </button>
          </div> */}
        </div>
      </div>
    </HeaderWrapper>
  );
};

const mapStateToProps = state => {
  // console.log(state, "check255");
  return {
    token: state.auth.accessToken,
    notificationData: state.navigation.notificationData,
    user: state.auth.user,
    kycStatus: state.navigation.kycStatus
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { logout, setUser })
)(Header);
