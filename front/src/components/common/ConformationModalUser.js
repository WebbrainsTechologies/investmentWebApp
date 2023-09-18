import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
// import DeleteIcon from "../../assets/images/images/deleteicon.svg";
// import LogoutIcon from "../../assets/images/images/logouticon.svg";
// import Loader1 from "assets/images/Loaders/loader-1.svg";

const ConformationModaluser = props => {
  const {
    isOpen,
    onClose,
    confirmText,
    message,
    handleConfirm,
    cancleBtnTxt,
    customIcon,
    titleTxt
  } = props;
  var confirmBtnText = confirmText || "Yes, delete it!";
  var custom = customIcon ? true : false;

  return (
    <div>
      <SweetAlert
        warning={!customIcon}
        custom={custom}
        showCancel
        show={isOpen}
        confirmBtnText={confirmBtnText}
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title={titleTxt ? titleTxt : ""}
        customIcon={customIcon}
        onConfirm={() => {
          handleConfirm();
          // setConfirmDelete(!confirmDelete);
        }}
        onCancel={onClose}
        cancelBtnText={cancleBtnTxt ? cancleBtnTxt : "Cancel"}
      >
        {message}
      </SweetAlert>
    </div>
  );
};
export default ConformationModaluser;
