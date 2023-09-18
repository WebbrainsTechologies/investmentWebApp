import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
// import enhancer from "./enhancer/LinkbankaccountEnhancer";
import NavigationActions from "redux/navigation/actions";
import { update_admin_profile } from "services/adminUserServices";
import authActions from "redux/auth/actions";
import {
  checkbankstatus,
  linkbankaccount,
  onMetaUserLogin
} from "services/onemetaapis";
import { useParams } from "react-router-dom";

const { success, error, fetching } = NavigationActions;
const { setUser } = authActions;
const ChooseBankAccount = props => {
  const { id } = useParams();
  const {
    handleChange,
    values,
    handleBlur,
    errors,
    touched,
    submitCount,
    handleSubmit,
    isValid,
    token,
    user
  } = props;

  const [loading, setLoading] = useState(false);
  const [useracessTokenByOnMeta, setUseracessTokenByOnMeta] = useState("");
  const [bankDetails, setBankDetails] = useState({});

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

  const getUserAccessTokenFromOnMeta = async () => {
    await onMetaUserLogin({
      email: user?.email
    }).then(res => {
      if (res?.success) {
        setUseracessTokenByOnMeta(res.data?.accessToken);
        setBankDetails(res.data?.bankDetails);
      } else {
        error(res.message);
      }
    });
  };
  // console.log(useracessTokenByOnMeta, "check53");
  useEffect(() => {
    user?.email && getUserAccessTokenFromOnMeta();
  }, []);

  // const handleEditUser = async (e) => {
  //   e.preventDefault();
  //   handleSubmit();
  //   if (isValid) {
  //     await linkbankaccount(useracessTokenByOnMeta, {
  //       name: values.bank_user_name,
  //       panNumber: values.bank_pan_number,
  //       kycVerfied: true,
  //       email: user?.email,
  //       bankDetails: {
  //         accountNumber: values.bank_account_number,
  //         accountName: values.bank_account_name,
  //         ifsc: values.bank_ifsc_code,
  //       },
  //       phone: {
  //         countryCode: values.country_code,
  //         number: values.bank_phone_number,
  //       },
  //     }).then(async (res) => {
  //       if (res.success) {
  //         let data = res?.data?.referenceNumber;
  //         if (data) {
  //           await checkbankstatus(useracessTokenByOnMeta, data).then(
  //             async (res) => {
  //               console.log(res, "check87");
  //               if (res.success) {
  //                 let bankstatus = res.data?.bankStatus;
  //                 if (bankstatus === "SUCCESS") {
  //                   var formData = new FormData();
  //                   // formData.append("bank_user_name", values.bank_user_name);
  //                   // formData.append("email", user?.email);
  //                   // formData.append(
  //                   //   "bank_phone_number",
  //                   //   values.bank_phone_number
  //                   // );
  //                   // formData.append("bank_pan_number", values.bank_pan_number);
  //                   // formData.append(
  //                   //   "bank_account_number",
  //                   //   values.bank_account_number
  //                   // );
  //                   // formData.append(
  //                   //   "bank_account_name",
  //                   //   values.bank_account_name
  //                   // );
  //                   formData.append(
  //                     "is_bank_verified",
  //                     values.is_bank_verified
  //                   );
  //                   // formData.append("country_code", values.country_code);
  //                   // formData.append("bank_ifsc_code", values.bank_ifsc_code);

  //                   setLoading(true);
  //                   await update_admin_profile(token, formData).then((res) => {
  //                     if (res.success) {
  //                       success(res.message);
  //                       setUser(res?.data[0]);
  //                       setLoading(false);
  //                     } else {
  //                       error(res.message);
  //                       setLoading(false);
  //                     }
  //                   });
  //                 }
  //               }
  //             }
  //           );
  //         }
  //       }
  //     });
  //   }
  // };
  return (
    <div>
      {/* <div className="row">
        <div className="col-6">
          <div className="form-group">

            <input
              type="text"
              className="form-control react-form-input"
              id="bank_user_name"
              onChange={handleChange}
              value={values.bank_user_name}
              onBlur={handleBlur}
              placeholder="User Name"
            />
            <Error field="bank_user_name" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Email</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="email"
              onChange={handleChange}
              value={user?.email}
              onBlur={handleBlur}
              placeholder="User Email"
              disabled
            />
            <Error field="email" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Country code</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="country_code"
              onChange={handleChange}
              value={values.country_code}
              onBlur={handleBlur}
              placeholder="Country code"
            />
            <Error field="country_code" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Phone</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="bank_phone_number"
              onChange={handleChange}
              value={values.bank_phone_number}
              onBlur={handleBlur}
              placeholder="Phone number"
            />
            <Error field="bank_phone_number" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Account Name</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="bank_account_name"
              onChange={handleChange}
              value={values.bank_account_name}
              onBlur={handleBlur}
              placeholder="Account Name"
            />
            <Error field="bank_account_name" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Account Number</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="bank_account_number"
              onChange={handleChange}
              value={values.bank_account_number}
              onBlur={handleBlur}
              placeholder="Account number"
            />
            <Error field="bank_account_number" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>IFSC code</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="bank_ifsc_code"
              onChange={handleChange}
              value={values.bank_ifsc_code}
              onBlur={handleBlur}
              placeholder="IFSC code"
            />
            <Error field="bank_ifsc_code" />
          </div>
        </div>
        <div className="col-6">
          <div className="form-group">
            <label>Pan Number</label> <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="bank_pan_number"
              onChange={handleChange}
              value={values.bank_pan_number}
              onBlur={handleBlur}
              placeholder="Pan number"
            />
            <Error field="bank_pan_number" />
          </div>
        </div>
      </div> */}
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-5">
            <div className="secure-admin-box mb-5 mb-sm-0">
              <div className="secure-box-body">
                <div className="min-total-row flex-column">
                  <span class="min-total-value min-total-value-between">
                    Account Name : <span>{bankDetails?.accountName}</span>
                  </span>
                  <span class="min-total-value min-total-value-between">
                    Account Number : <span>{bankDetails?.accountNumber}</span>
                  </span>
                  <span class="min-total-value min-total-value-between">
                    IFSC Code : <span>{bankDetails?.ifsc}</span>
                  </span>
                </div>
                <div className="row mt-3 jutify-content-between">
                  <div className="col-sm-4">
                    <button
                      className="btn btn-blue"
                      onClick={() => {
                        props.history.push(
                          `/linkbankaccount?editpage=editpage&&id=${id}`
                        );
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="col-sm-8 text-right">
                    <button
                      className="btn modalcancelbutton mr-3"
                      onClick={() => {
                        props.history.goBack();
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-blue"
                      onClick={e => {
                        props.history.push(`/withdrawalscreen/${id}`);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  // enhancer,
  connect(mapStateToProps, { success, error, fetching, setUser })
)(ChooseBankAccount);
