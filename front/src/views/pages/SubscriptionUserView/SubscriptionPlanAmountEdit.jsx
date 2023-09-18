import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ModalBody } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/SubscriptionPlanAmountEditEnhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import { addUserSubscription } from "services/userSubscriptionServices";
import terms_condition_pdf from "../../../assets/termsandconditions/GTC-SF.pdf";
import { onMetaUserLogin } from "services/onemetaapis";

const { success, error } = NavigationActions;
const SubscriptionPlanAmountEdit = props => {
  const { isEdit, editData, onClose, subscriptionData } = props;
  const {
    user,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    token,
    isValid,
    setValues,
    handleSubmit,
    toggleRefresh,
    isView
  } = props;
  const [loading, setLoading] = useState(false);
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");
  useEffect(() => {
    setValues({
      quantity: 1,
      amount: subscriptionData?.amount * 1,
      minimum_value: subscriptionData?.minimum_value,
      terms_condition: false,
      other_terms_condition: false
    });
  }, [subscriptionData]);
  // console.log(errors, "checkyuperrors");

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
  // console.log(useracessTokenByOnMeta, "check53");
  useEffect(() => {
    user?.email && getUserAccessTokenFromOnMeta();
  }, []);
  const ServiceHandler = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      let data = {
        amount: Number(values.amount)
      };
      setLoading(true);

      await addUserSubscription(token, subscriptionData?._id, data).then(
        res => {
          if (res.success) {
            success(res.message);
            onClose();
          } else {
            error(res.message);
            onClose();
          }
        }
      );
    }
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
  return (
    <>
      <ModalBody>
        <form>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label>
                  Amount <span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="amount"
                  value={subscriptionData?.amount}
                  disabled
                  readOnly
                  placeholder="Package Amount"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>
                  Quantity <span className="red">*</span>
                </label>
                <div className="quantity-row">
                  <button
                    className="plusminusbtn"
                    onClick={e => {
                      e.preventDefault();
                      setValues({
                        ...values,
                        quantity:
                          Number(values.quantity) > 1
                            ? Number(values.quantity) - 1
                            : 1,
                        amount:
                          Number(subscriptionData.amount) *
                          (Number(values.quantity) > 1
                            ? Number(values.quantity) - 1
                            : 1)
                      });
                    }}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="form-control react-form-input pluminusinput"
                    id="quantity"
                    value={values.quantity}
                    placeholder="Package Amount"
                    onChange={e => {
                      setValues({
                        ...values,
                        quantity: e.target.value,
                        amount:
                          Number(subscriptionData.amount) *
                          Number(e.target.value)
                      });
                    }}
                    onBlur={handleBlur}
                  />
                  <button
                    className="plusminusbtn"
                    onClick={e => {
                      e.preventDefault();
                      // console.log(values, "checkvalues139");
                      setValues({
                        ...values,
                        quantity: Number(values.quantity) + 1,
                        amount:
                          Number(subscriptionData.amount) *
                          (Number(values.quantity) + 1)
                      });
                    }}
                  >
                    +
                  </button>
                </div>
                <Error field="quantity" />
              </div>
            </div>
            <div className="col-12 mb-2">
              <span>Minimum buy value {Number(values.minimum_value)}</span>
            </div>
            <div className="col-12 mb-2">
              Total value : {Number(values.amount)}
              <div>
                <Error field="amount" />
              </div>
              {/* {Number(subscriptionData?.amount) * Number(values.quantity)} */}
            </div>
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck1"
                  name="terms_condition"
                  checked={values.terms_condition}
                  onChange={e => {
                    setValues({ ...values, terms_condition: e.target.checked });
                  }}
                  onBlur={handleBlur}
                />
                <label
                  className="form-check-label register-privacy-text"
                  htmlFor="exampleCheck1"
                >
                  Agree to{" "}
                  <a
                    href={terms_condition_pdf}
                    className="link-label"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms & privacy policy
                  </a>
                </label>
              </div>
              <Error field="terms_condition" />
            </div>
            <div className="col-12 mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="exampleCheck2"
                  name="other_terms_condition"
                  checked={values.other_terms_condition}
                  onChange={e => {
                    setValues({
                      ...values,
                      other_terms_condition: e.target.checked
                    });
                  }}
                  onBlur={handleBlur}
                />
                <label
                  className="form-check-label register-privacy-text"
                  htmlFor="exampleCheck2"
                  style={{ textAlign: "justify" }}
                >
                  By ticking the box, I am aware that Company shall provide max
                  upto 75% withdrawal of my principle amount in case early
                  closure of the contract. I confirm my knowledge that by this
                  consent, I lose my execution of the company contract for the
                  remaining term.
                </label>
              </div>
              <Error field="other_terms_condition" />
            </div>
            <div className="col-12 mb-2"></div>
            <div className="col-12">
              <div className="row justify-content-end">
                <div className="col">
                  <button
                    onClick={e => ServiceHandler(e)}
                    type="submit"
                    className="btn btn-blue w-100"
                    // disabled={isValid ? false : true}
                  >
                    Proceed
                  </button>
                </div>
                <div className="col">
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="btn form-button modalcancelbutton"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </ModalBody>
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
  enhancer,
  connect(mapStateToProps, { success, error })
)(SubscriptionPlanAmountEdit);
