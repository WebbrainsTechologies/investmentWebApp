import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";

const { success, error } = NavigationActions;
const Updateutr = props => {
  const { subscriptionData, history } = props;
  // console.log("subscriptionData", subscriptionData);

  return (
    <div className="p-4">
      <div className="row justify-content-end">
        <div className="col-12 text-center mb-3 text-bold">
          Please select the method
        </div>
        <div className="col-auto pr-0">
          <button
            onClick={e => {
              e.preventDefault();
              history.push(`/manuallpaymentpage/${subscriptionData}`);
            }}
            type="submit"
            className="btn btn-blue"
          >
            Manually
          </button>
        </div>
        <div className="col-auto">
          <button
            onClick={e => {
              e.preventDefault();
              history.push(`/paymentpage/${subscriptionData}`);
            }}
            className="btn form-button modalcancelbutton"
          >
            Onmeta
          </button>
        </div>
      </div>
    </div>
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
  connect(mapStateToProps, { success, error })
)(Updateutr);
