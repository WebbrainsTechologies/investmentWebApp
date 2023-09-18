import Loader from "components/Loader";
import ConformationModaluser from "components/common/ConformationModalUser";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import { getallSubscription } from "services/subscriptionServices";
import { addUserSubscription } from "services/userSubscriptionServices";
import SubscriptionPlanAmountEdit from "./SubscriptionPlanAmountEdit";
import { Modal } from "reactstrap";
import ChooseMethodModal from "./ChooseMethodModal";

const { success, error, fetching } = NavigationActions;

const Subscriptionview = props => {
  const { success, error, token, history } = props;
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [refresh, toggleRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [chooseModal, setChooseModal] = useState(false);
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
  const getSubscriptionList = async () => {
    setLoading(true);
    await getallSubscription(token).then(res => {
      if (res.success) {
        setSubscriptionList(res.data);
        toggleRefresh(false);
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    refresh && getSubscriptionList();
  }, [refresh]);

  const purchaseSubscription = async id => {
    await addUserSubscription(token, id).then(res => {
      if (res.success) {
        success(res.message);
        closeConfrimModal();
      } else {
        error(res.message);
        closeConfrimModal();
      }
    });
  };
  return (
    <>
      <h4 className="page-title">investment plans</h4>
      <div className="white-card">
        <div className="row">
          <div className="col-xl-12 mx-auto subscription-plan-main">
            <h4 className="subscribe-title text-center">
              Subscribe Our Investment Plans
            </h4>
            {loading ? (
              <Loader />
            ) : (
              <div className="row">
                {subscriptionList?.length > 0 &&
                  subscriptionList.map(val => {
                    return (
                      <div
                        className="col-md-6 col-xl-4 my-4 subscriptioncardhover"
                        key={val._id}
                      >
                        <div className="subscriptioncard">
                          <h4>{val.name}</h4>
                          <p
                            className="plan-description three-line-plan-description"
                            dangerouslySetInnerHTML={{
                              __html: val.description
                            }}
                          />
                          <div className="sub-detail-box">
                            Amount
                            <p className="large-text">
                              {val.minimum_value} {val.currency}
                            </p>
                          </div>
                          <div className="sub-detail-box">
                            Rate of Interest
                            <p className="large-text">{val.roi}%</p>
                          </div>
                          <div className="sub-detail-box">
                            ROI Frequency
                            <p className="large-text">{val.roi_duration}</p>
                          </div>
                          <div className="sub-detail-box">
                            Duration
                            <p className="large-text">
                              {val.duration === 1
                                ? `${val.duration} Month`
                                : `${val.duration} Months`}
                            </p>
                          </div>
                          <button
                            className="btn btn-blue subscriptionbtn w-100"
                            onClick={() => {
                              // setConfirmProps({
                              //   isOpen: true,
                              //   confirmText: "Yes",
                              //   confirmMessage: `Are you sure you want to invest in ${val.name} subscription?`,
                              //   confirmFunc: () =>
                              //     purchaseSubscription(val._id),
                              // });
                              // setOpenModal(true);
                              // setSelectedSubscriptionData(val);
                              history.push(`choosePaymentMethod/${val._id}`);
                            }}
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Modal isOpen={openModal} backdrop={true}>
        {openModal && (
          <SubscriptionPlanAmountEdit
            subscriptionData={subscriptionData}
            onClose={() => {
              setOpenModal(false);
            }}
          />
        )}
      </Modal> */}
      <Modal isOpen={chooseModal} backdrop={true}>
        <ChooseMethodModal subscriptionData={subscriptionData} />
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
)(Subscriptionview);
