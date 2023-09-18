import React, { useEffect, useState } from "react";
import ManualWithdrawalEnhancer from "./enhancer/ManualWithdrawalEnhancer";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { connect } from "react-redux";
import { compose } from "redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import navigationAction from "redux/navigation/actions";
import { addUserWithdrawalRequest } from "services/withdrawalServices";
import Loader from "components/Loader";
const { success, error, fetching } = navigationAction;

function ManualWithdrawal(props) {
  const {
    values,
    isValid,
    handleSubmit,
    touched,
    errors,
    setValues,
    getFieldProps,
    token,
    submitCount,
    history,
    walletAmount
  } = props;
  const { id } = useParams();
  // const queryParams = new URLSearchParams(window.location.search);
  // const walletAmount = queryParams.get("walletAmount");
  const [loading, setLoading] = useState(false);
  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  // console.log(walletAmount, "check312143123123");
  const handleWithdrawRequest = async e => {
    setSubmitDisabled(true);
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      setLoading(true);
      // delete values["walletAmount"];
      await addUserWithdrawalRequest(token, {
        ...values,
        currencyId: id,
        walletAmount: walletAmount,
        withdrawal_type: "manual"
      }).then(res => {
        if (res.success) {
          success(res.message);
          setSubmitDisabled(false);
          history.push("/dashboard");
        } else {
          error(res.message);
        }
      });
      setLoading(false);
    }
    setSubmitDisabled(false);
  };

  const Error = props => {
    const field1 = props.field;
    if ((errors[field1] && touched[field1]) || submitCount > 0) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors[field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };

  useEffect(() => {
    walletAmount &&
      setValues({
        ...values,
        walletAmount: Number(walletAmount),
        currencyId: id
      });
  }, [walletAmount]);

  return (
    <div className="row justify-content-center">
      <div className="col-md-10 col-lg-8 col-xl-5">
        <div className="secure-admin-box mb-5 mb-sm-0">
          <h2 className="secure-box-title justify-content-between">
            Manual Withdrawal form
          </h2>
          <div className="secure-box-body">
            <form onSubmit={handleWithdrawRequest}>
              <div className="row">
                <div className="col-12 mb-2">
                  <div className="form-group secure-form-group">
                    <label>Network Type</label> <span className="red">*</span>
                    <select
                      name="network_type"
                      id="network_type"
                      defaultValue={""}
                      onChange={e => {
                        setValues({ ...values, network_type: e.target.value });
                      }}
                      className="custom-select"
                    >
                      <option value={""} hidden>
                        Please select network type
                      </option>
                      <option value={"TRC20"}>TRC20</option>
                    </select>
                    <Error field="network_type" />
                  </div>
                </div>
                {/* <div className="col-12 ">
                  <div className="form-group secure-form-group">
                    <label>Network Type</label> <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder={"Enter Network Type"}
                      {...getFieldProps("network_type")}
                    />
                    <Error field="network_type" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="form-group secure-form-group">
                    <label>Withdraw Amount</label>{" "}
                    <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder="Enter withdrawal amount"
                      {...getFieldProps("amount")}
                    />
                    <p>Available balance : {walletAmount}</p>
                    <Error field="amount" />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group secure-form-group">
                    <label>Deposit Wallet Address</label>{" "}
                    <span className="red">*</span>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="email"
                      placeholder="Enter Deposit Wallet Address"
                      {...getFieldProps("walletAddress")}
                    />
                    <Error field="walletAddress" />
                  </div>
                </div>
                <div className="col-12  mt-2 mb-2">
                  <div className="row ">
                    <div className="col-6">
                      <button
                        className="btn form-button modalcancelbutton w-100 mt-2"
                        onClick={() => {
                          history.go(-1);
                        }}
                      >
                        Cancel{" "}
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        className="btn btn-blue w-100 mt-2"
                        onClick={handleWithdrawRequest}
                        disabled={isSubmitDisabled}
                        type="submit"
                      >
                        Submit{" "}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
}

const mapStateToProps = state => {
  // console.log(state, "check159");
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    walletAmount: state.navigation.walletValue
  };
};
export default compose(
  withRouter,
  ManualWithdrawalEnhancer,
  connect(mapStateToProps, { success, error, fetching })
)(ManualWithdrawal);
