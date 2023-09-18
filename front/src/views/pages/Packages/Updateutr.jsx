import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import {
  featchOrderStatus,
  onMetaUserLogin,
  updateUtr
} from "services/onemetaapis";
import { changeSubscriberSubscriptionStatus } from "services/userSubscriptionServices";
import { addonmetaLogs } from "services/onmetaLogsServices";

const { success, error } = NavigationActions;
const Updateutr = props => {
  const { orderId, onclose, localSubscriptionId, user } = props;
  const { token } = props;
  const [loading, setLoading] = useState(false);
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");

  const [utr, setUtr] = useState("");
  const [disabledbtn, setDisableBtn] = useState(false);
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

  const utrHandler = async () => {
    let data = {
      orderId: orderId,
      utr: utr
    };
    await updateUtr(useracessTokenByOnMeta, data).then(async res => {
      let logdata = {
        url: `${
          process.env.REACT_APP_ONMETA_URI
            ? process.env.REACT_APP_ONMETA_URI
            : ""
        }/orders/utr`,
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
      if (res.success) {
        await featchOrderStatus(useracessTokenByOnMeta, {
          orderId: data.orderId
        }).then(async res => {
          // console.log(res, "check239");
          let logdata = {
            url: `${
              process.env.REACT_APP_ONMETA_URI
                ? process.env.REACT_APP_ONMETA_URI
                : ""
            }/orders/status`,
            response: JSON.stringify(res),
            request: JSON.stringify({
              orderId: data.orderId
            })
          };
          await addonmetaLogs(token, logdata).then(res => {
            if (res.success) {
              // console.log(res);
            } else {
              error(res.message);
            }
          });
          // console.log(res, "check85");
          if (res?.success) {
            if (
              !(
                res.data?.status === "fiatPending" ||
                res.data?.status === "InProgress" ||
                res.data?.status === "expired" ||
                res.data?.status === "cancelled"
              )
            ) {
              await changeSubscriberSubscriptionStatus(
                token,
                localSubscriptionId,
                {
                  usersubscriptionstatus:
                    res.data?.status === "cancelled" ? "Cancelled" : "Accepted",
                  userId: user._id,
                  onemeta_reason: res.data?.reason ? res.data?.reason : ""
                }
              ).then(res => {
                if (res.success) {
                  success(res.message);
                  setDisableBtn(false);
                  onclose();
                } else {
                  error(res.message);
                  setDisableBtn(false);
                }
              });
            } else {
              // console.log(res, "check115");
              setDisableBtn(false);
            }
          } else {
            // console.log(res, "check69");
            error(res.error.message);
            setDisableBtn(false);
          }
        });
      } else {
        // console.log(res, "check75");
        error(res.error.message);
        if (res?.error?.message === "Order already success, can't update UTR") {
          await featchOrderStatus(useracessTokenByOnMeta, {
            orderId: data.orderId
          }).then(async res => {
            // console.log(res, "check239");
            let logdata = {
              url: `${
                process.env.REACT_APP_ONMETA_URI
                  ? process.env.REACT_APP_ONMETA_URI
                  : ""
              }/orders/status`,
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
                // res.data?.status !==
                // ("fiatPending" || "InProgress" || "expired" || "cancelled")
                !(
                  res.data?.status === "fiatPending" ||
                  res.data?.status === "InProgress" ||
                  res.data?.status === "expired" ||
                  res.data?.status === "cancelled"
                )
              ) {
                await changeSubscriberSubscriptionStatus(
                  token,
                  localSubscriptionId,
                  {
                    usersubscriptionstatus:
                      res.data?.status === "cancelled"
                        ? "Cancelled"
                        : "Accepted",
                    userId: user._id,
                    onemeta_reason: res.data?.reason ? res.data?.reason : ""
                  }
                ).then(res => {
                  if (res.success) {
                    success(res.message);
                    onclose();
                  } else {
                    error(res.message);
                  }
                });
              } else {
                // console.log(res, "check115");
                setDisableBtn(false);
              }
            } else {
              // console.log(res, "check69");
              error(res.error.message);
            }
          });
        }
        setDisableBtn(true);
      }
    });
  };

  return (
    <>
      <div className="form-group m-4">
        <label>
          UTR <span className="red">*</span>
        </label>
        <input
          type="text"
          className="form-control react-form-input"
          id="utr"
          onChange={e => {
            setUtr(e.target.value);
          }}
          value={utr}
          placeholder="Enter UTR  value"
        />
      </div>

      <div className="row justify-content-center m-2">
        <div className="col-auto pr-0">
          <button
            disabled={disabledbtn}
            onClick={e => {
              e.preventDefault();
              setDisableBtn(true);
              utrHandler();
            }}
            type="submit"
            className="btn btn-blue "
          >
            Update
          </button>
        </div>
        <div className="col-auto">
          <button
            onClick={() => {
              onclose();
            }}
            className="btn form-button modalcancelbutton"
          >
            Cancel
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
