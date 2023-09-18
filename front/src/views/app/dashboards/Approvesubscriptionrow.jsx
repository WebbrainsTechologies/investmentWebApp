import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { connect } from "react-redux";
import { UncontrolledCollapse } from "reactstrap";
import { getUserFuturePayout } from "services/futurePaymentServices";
import NavigationActions from "redux/navigation/actions";
import Futurepaymentusertable from "./Futurepaymentusertable";
import moment from "moment";
import { getUserFuturePayoutByuserId } from "services/userDetailServices";

const { success, error, fetching } = NavigationActions;

export const Approvesubscriptionrow = props => {
  const { value, token, error, userId } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState(1);
  const [userSubscriptionId, setUserSubscriptionId] = useState("");
  const [futurepaymentData, setFuturePaymentData] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const getUserSubscriptionDetails = async () => {
    let data = {
      // year: year,
      userSubscriptionId: userSubscriptionId,
      createdAt: createdAt
    };
    userId
      ? await getUserFuturePayoutByuserId(token, userId, data).then(res => {
          if (res.success) {
            setFuturePaymentData(res.data);
          } else {
            error(res.message);
          }
        })
      : await getUserFuturePayout(token, data).then(res => {
          if (res.success) {
            // console.log(res.data, "check24");
            // setFuturePaymentData(
            //   res.data?.map((val) => {
            //     let createdAtDate = moment(val.createdAt);
            //     let roiDate = moment(val.roi_date);
            //     let today = moment(new Date());
            //     let totaldays = roiDate.diff(createdAtDate, "days");
            //     let completedDate = today.diff(createdAtDate, "days");
            //     let progresswith = (completedDate * 100) / totaldays;
            //     console.log(
            //       completedDate,
            //       totaldays,
            //       "completedDate",
            //       createdAtDate,
            //       roiDate
            //     );
            //     return {
            //       ...val,
            //       progress: progresswith,
            //     };
            //   })
            // );
            setFuturePaymentData(res.data);
          } else {
            error(res.message);
          }
        });
  };
  useEffect(() => {
    userSubscriptionId && getUserSubscriptionDetails();
  }, [userSubscriptionId, year]);
  return (
    <>
      {/* {console.log(value, "checkvalue")} */}
      <div
        className={
          isOpen
            ? "existing-pack-row existing-pack-row-open"
            : "existing-pack-row"
        }
        id={`toggler-${value._id}`}
        onClick={() => {
          setUserSubscriptionId(value._id);
          setCreatedAt(value.createdAt);
          setIsOpen(!isOpen);
          // if (isOpen) {
          //   setYear(1);
          // }
        }}
      >
        <div className="existing-pack-title">
          <span className="existing-pack-arrow">
            {isOpen ? (
              <i class="fas fa-angle-double-up"></i>
            ) : (
              <i class="fas fa-angle-double-down"></i>
            )}
          </span>
          Package name : <b className="text-uppercase">{value.name}</b>
          <p className="existing-pack-usdt">
            {value.amount + " " + value.currency}
          </p>
        </div>
        <ul className="existing-pack-list">
          <li>
            investment date :
            <span>{moment(value.createdAt).format("DD/MM/YYYY")}</span>
          </li>
          <li>
            Expiry date :
            <span>
              {moment(value.package_expiry_date).format("DD/MM/YYYY")}
            </span>
          </li>
          <li>
            Duration :
            <span>
              {value.duration > 1
                ? `${value.duration} Months`
                : `${value.duration} Month`}
            </span>
          </li>
        </ul>
      </div>
      <UncontrolledCollapse toggler={`#toggler-${value._id}`} className="w-100">
        {/* <div className="package-table-btns">
          <button
            onClick={() => {
              setYear(1);
            }}
            className={year === 1 ? "active" : ""}
          >
            1 year
          </button>
          <button
            className={year === 2 ? "active" : ""}
            onClick={() => {
              setYear(2);
            }}
          >
            2 year
          </button>
          <button
            className={year === 3 ? "active" : ""}
            onClick={() => {
              setYear(3);
            }}
          >
            3 year
          </button>
          <button
            className={year === 4 ? "active" : ""}
            onClick={() => {
              setYear(4);
            }}
          >
            4 year
          </button>
          <button
            className={year === 5 ? "active" : ""}
            onClick={() => {
              setYear(5);
            }}
          >
            5 year
          </button>
        </div> */}
        <Futurepaymentusertable futurepaymentData={futurepaymentData} />
      </UncontrolledCollapse>
      {/* <Futurepaymentusertable futurepaymentData={futurepaymentData} /> */}
    </>
  );
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default connect(mapStateToProps, { success, error, fetching })(
  Approvesubscriptionrow
);
