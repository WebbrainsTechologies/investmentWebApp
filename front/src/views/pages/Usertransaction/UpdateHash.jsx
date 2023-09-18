import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import {
  featchOrderStatus,
  offRampFeatchOrderStatus,
  offRampUpdateHash,
  onMetaUserLogin,
  updateUtr
} from "services/onemetaapis";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";
import { changeWithdrawalRequestStatus } from "services/withdrawalServices";
import { Hash } from "react-feather";
import { addonmetaLogs } from "services/onmetaLogsServices";

const { success, error } = NavigationActions;
const Updateutr = props => {
  const { orderId, onclose, localSubscriptionId, user, withdrawalData } = props;
  const { token } = props;
  const [loading, setLoading] = useState(false);
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");
  const [hashbtndisable, setHashbtndisable] = useState(false);

  const [hash, setHash] = useState("");
  // console.log(withdrawalData, "check25");
  const getUserAccessTokenFromOnMeta = async () => {
    await onMetaUserLogin({
      email: user?.email
    }).then(res => {
      if (res?.success) {
        setUseracessTokenByOnMeta(res.data?.accessToken);
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    user?.email && getUserAccessTokenFromOnMeta();
  }, []);

  const hashHandler = async () => {
    let data = {
      orderId: withdrawalData?.orderId,
      txnHash: hash
    };
    await offRampUpdateHash(useracessTokenByOnMeta, data).then(async res => {
      let logdata = {
        url: `${
          process.env.REACT_APP_ONMETA_URI
            ? process.env.REACT_APP_ONMETA_URI
            : ""
        }/offramp/orders/txnhash`,
        response: JSON.stringify(res),
        request: JSON.stringify(data)
      };
      await addonmetaLogs(token, logdata).then(res => {
        if (res.success) {
          console.log(res);
        } else {
          error(res.message);
        }
      });
      if (res.success) {
        await offRampFeatchOrderStatus(useracessTokenByOnMeta, {
          orderId: data.orderId
        }).then(async res => {
          // console.log(res, "check239");
          let logdata = {
            url: `${
              process.env.REACT_APP_ONMETA_URI
                ? process.env.REACT_APP_ONMETA_URI
                : ""
            }/offramp/orders/status`,
            response: JSON.stringify(res),
            request: JSON.stringify({
              orderId: data.orderId
            })
          };
          await addonmetaLogs(token, logdata).then(res => {
            if (res.success) {
              console.log(res);
            } else {
              error(res.message);
            }
          });
          if (res?.success) {
            if (
              !(
                res.data?.status === "pending" ||
                res.data?.status === "InProgress"
              )
            ) {
              await changeWithdrawalRequestStatus(
                token,
                withdrawalData?.localSubscriptionId,
                {
                  status:
                    res.data?.status === "refunded" ? "Rejected" : "Accepted",
                  userId: user._id,
                  hash_value: hash
                }
              ).then(res => {
                if (res.success) {
                  success(res.message);
                  setHashbtndisable(false);
                  onclose();
                } else {
                  error(res.message);
                  setHashbtndisable(false);
                  onclose();
                }
              });
            }
          } else {
            // console.log(res, "check69");
            error(res.error.message);
            setHashbtndisable(false);
            onclose();
          }
        });
      } else {
        // console.log(res, "check75");
        error(res?.error?.message ? res?.error?.message : res?.message);
        setHashbtndisable(false);
        onclose();
        // if (res?.error?.message === "Order already success, can't update UTR") {
        //   await featchOrderStatus(useracessTokenByOnMeta, {
        //     orderId: data.orderId,
        //   }).then(async (res) => {
        //     console.log(res, "check239");
        //     if (res?.success) {
        //       if (
        //         res.data?.status !==
        //         ("fiatPending" || "InProgress" || "expired" || "cancelled")
        //       ) {
        //         await changeSubscriberSubscriptionStatus(
        //           token,
        //           localSubscriptionId,
        //           {
        //             usersubscriptionstatus:
        //               res.data?.status === "cancelled"
        //                 ? "Cancelled"
        //                 : "Accepted",
        //             userId: user._id,
        //             onemeta_reason: res.data?.reason ? res.data?.reason : "",
        //           }
        //         ).then((res) => {
        //           if (res.success) {
        //             success(res.message);
        //             onclose();
        //           } else {
        //             error(res.message);
        //           }
        //         });
        //       }
        //     } else {
        //       console.log(res, "check69");
        //       error(res.error.message);
        //     }
        //   });
        // }
      }
    });
  };

  return (
    <>
      <div className="form-group m-4">
        <label>
          Hash <span className="red">*</span>
        </label>
        <input
          type="text"
          className="form-control react-form-input"
          id="hash"
          onChange={e => {
            setHash(e.target.value);
          }}
          value={hash}
          placeholder="Enter Hash value"
        />
      </div>

      <div className="row justify-content-center m-2">
        <div className="col-auto pr-0">
          <button
            onClick={() => {
              onclose();
            }}
            className="btn form-button modalcancelbutton"
          >
            Cancel
          </button>
        </div>
        <div className="col-auto">
          <button
            disabled={hashbtndisable || !hash}
            onClick={e => {
              e.preventDefault();
              setHashbtndisable(true);
              hashHandler();
            }}
            type="submit"
            className="btn btn-blue "
          >
            Update
          </button>
        </div>
      </div>
      {loading ? <Loader /> : ""}
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
  // withRouter,
  connect(mapStateToProps, { success, error })
)(Updateutr);
