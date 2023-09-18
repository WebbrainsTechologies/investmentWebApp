import React from "react";
import { useHistory } from "react-router-dom";
import { markEscalatNotificationReadById } from "services/userNotificationServices";

const PopoverBlock = ({
  title,
  text,
  created,
  link,
  id,
  token,
  getNotificationData,
  userNotifications,
  setNotificationPopoverOpen
}) => {
  let history = useHistory();
  const markNotificationRead = async (id, n_link) => {
    await markEscalatNotificationReadById(token, id).then(data => {
      history.push(n_link);
      setNotificationPopoverOpen(false);
      userNotifications(token);
      getNotificationData(token);
    });
  };
  return (
    <div
      style={{ cursor: "pointer" }}
      className="mail-popover-block"
      onClick={() => markNotificationRead(id, link)}
    >
      {/* {console.log(title, text, created, id, link, "check29")} */}
      <div className="flex-x">
        <div className="flex-1">
          <div className="fs-13 demi-bold-text">{title}</div>
          <div className="fs-11 medium-text">{text}</div>
        </div>
        <div className="fs-10 medium-text">{created}</div>
      </div>
    </div>
  );
};

export default PopoverBlock;
