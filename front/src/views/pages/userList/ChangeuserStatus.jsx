import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import detail_img from "../../../assets/images/alert-icon.svg";
import { userStatusUpdate } from "services/userProfileServices";

const { success, error, fetching } = NavigationActions;

const ChangeuserStatus = props => {
  const { token, selectedId, onClose, selectedStatus } = props;

  const [btnDisable, setBtnDisable] = useState(false);

  const updateStatus = async () => {
    setBtnDisable(true);
    fetching();
    await userStatusUpdate(token, selectedId, {
      is_delete: selectedStatus
    }).then(data => {
      if (data.success) {
        success(data.message);
        onClose();
        setBtnDisable(false);
      } else {
        error(data.message);
        onClose();
        setBtnDisable(false);
      }
    });
  };
  return (
    <>
      <div className="row text-center py-4">
        <div className="col-12">
          <img src={detail_img} alt="modal_img" style={{ maxWidth: "85px" }} />
          <p style={{ margin: "35px 0 25px", fontSize: "18px" }}>
            Are you sure to change status?
          </p>
          <div className="row justify-content-center">
            <div className="col-auto">
              <button
                className="btn"
                style={{ fontSize: "18px" }}
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-danger"
                disabled={btnDisable}
                style={{
                  fontSize: "18px",
                  boxShadow: "0px 0px 10px 0px rgba(222, 0, 45, 0.50)"
                }}
                onClick={() => {
                  updateStatus();
                }}
              >
                Change
              </button>
            </div>
          </div>
        </div>
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
  connect(mapStateToProps, { success, error, fetching })
)(ChangeuserStatus);
