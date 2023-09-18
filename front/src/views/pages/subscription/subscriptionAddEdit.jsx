import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/subscriptionAddEditEnhancer";
import NavigationActions from "redux/navigation/actions";
import {
  addSubscription,
  editSubscription
} from "services/subscriptionServices";
import Loader from "components/Loader";
import { getallCurrency } from "services/currencyServices";
import { getallDuration } from "services/durationServices";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { success, error } = NavigationActions;
const SubscriptionAddEdit = props => {
  const { isEdit, editData, onClose } = props;
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    token,
    isValid,
    setValues,
    setFieldValue,
    handleSubmit,
    toggleRefresh,
    isView
  } = props;
  const [loading, setLoading] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const [durationList, setDurationList] = useState([]);
  const [roiDuration, setRoiDuration] = useState([
    {
      value: "daily",
      label: "Daily"
    },
    {
      value: "monthly",
      label: "Monthly"
    },
    {
      value: "quarterly",
      label: "Quarterly"
    },
    {
      value: "halfyearly",
      label: "Halfyearly"
    },
    {
      value: "yearly",
      label: "Yearly"
    },
    {
      value: "one and half year",
      label: "1.5 Year"
    },
    {
      value: "two year",
      label: "2 Year"
    },
    {
      value: "two and half year",
      label: "2.5 Year"
    },
    {
      value: "three year",
      label: "3 Year"
    },
    {
      value: "three and half year",
      label: "3.5 Year"
    },
    {
      value: "four year",
      label: "4 Year"
    },
    {
      value: "four and half year",
      label: "4.5 Year"
    },
    {
      value: "five year",
      label: "5 Year"
    }
  ]);

  const ServiceHandler = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      let data = {
        name: values.name,
        currency: values.currency,
        amount: values.amount,
        // multiply_value: values.multiply_value,
        duration: values.duration,
        roi: values.roi,
        roi_duration: values.roi_duration,
        principal_withdrawal: values.principal_withdrawal,
        commision_method: values.commision_method,
        commision: values.commision,
        description: values.description,
        maximum_value: values.maximum_value,
        minimum_value: values.minimum_value,
        status: values.status
      };
      setLoading(true);
      isEdit
        ? await editSubscription(token, values._id, data).then(res => {
            if (res.success) {
              success(res.message);
              setLoading(false);
              // console.log(res, "edit response")
              toggleRefresh(true);
              onClose();
              // getServiceHandler();
            } else {
              error(res.message);
              setLoading(false);
            }
          })
        : await addSubscription(token, data).then(res => {
            if (res.success) {
              // console.log("add response", res);
              success(res.message);
              setLoading(false);
              // getServiceHandler();
              toggleRefresh(true);
              onClose();
            } else {
              error(res.message);
              setLoading(false);
            }
          });
    }
  };
  const getCurrencyList = async () => {
    await getallCurrency(token)
      .then(res => {
        setCurrencyList(
          res.data?.map(val => ({
            label: val.name,
            value: val._id
            // multiply_value: val.multiply_value
          }))
        );
      })
      .catch(error => {
        error(error.message);
        // console.log(error);
      });
  };
  useEffect(() => {
    (isEdit || isView) &&
      setValues({
        ...editData,
        currency: editData.currencyId ? editData.currencyId : "",
        maximum_value: editData.maximum_value ? editData.maximum_value : ""
      });
  }, [editData]);
  useEffect(() => {
    getCurrencyList();
  }, []);
  const getDurationList = async () => {
    await getallDuration(token)
      .then(res => {
        setDurationList(
          res.data?.map(val => ({
            label:
              val.month === 1 ? `${val.month} Month` : `${val.month} Months`,
            value: val.month,
            _id: val._id
          }))
        );
      })
      .catch(error => {
        error(error.message);
      });
  };
  useEffect(() => {
    getDurationList();
  }, []);

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
      <ModalHeader toggle={() => onClose()}>
        {isView ? "View" : isEdit ? "Edit" : "Add"} Package
      </ModalHeader>
      <ModalBody>
        <form>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label>
                  Name <span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="name"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                  placeholder="Package Name"
                  disabled={isView ? true : false}
                />
                <Error field="name" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Currency <span className="red">*</span>
                </label>
                <select
                  className="detail-input-select custom-select"
                  value={values?.currency}
                  name="currency"
                  // onChange={(e) => {
                  //   console.log(e.target, "check154");
                  //   if (e.target.value) {
                  //     // setValues({ ...values,currency: e.target.value })
                  //     let data = currencyList.find((val) => {
                  //       console.log(val, "checkval", e.target.value);
                  //       return val.value === e.target.value;
                  //     });
                  //     setValues({
                  //       ...values,
                  //       currency: data.value,
                  //       // multiply_value: data.multiply_value
                  //     });
                  //   }
                  // }}
                  onChange={isView || isEdit ? () => {} : handleChange}
                  onBlur={handleBlur}
                  disabled={isView ? true : isEdit ? true : false}
                >
                  <option hidden disabled value="">
                    Select Currency
                  </option>
                  {currencyList?.length > 0 &&
                    currencyList.map(val => (
                      <option value={val.value} key={val.value}>
                        {val.label}
                      </option>
                    ))}
                </select>
                <Error field="currency" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Amount<span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="amount"
                  onChange={handleChange}
                  value={values.amount}
                  onBlur={handleBlur}
                  placeholder="Amount"
                  disabled={isView ? true : false}
                />
                <Error field="amount" />
              </div>
            </div>
            {/* <div className="col-6">
              <div className="form-group">
                <label>
                  Value<span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="multiply_value"
                  onChange={handleChange}
                  value={values.multiply_value}
                  onBlur={handleBlur}
                  placeholder="Value"
                  disabled={isView ? true : true}
                />
                <Error field="multiply_value" />
              </div>
            </div> */}
            <div className="col-6">
              <div className="form-group">
                <label>
                  Duration <span className="red">*</span>
                </label>
                <select
                  className="detail-input-select custom-select"
                  value={values?.duration}
                  name="duration"
                  onChange={isView || isEdit ? () => {} : handleChange}
                  onBlur={handleBlur}
                  disabled={isView ? true : isEdit ? true : false}
                >
                  <option hidden disabled value="">
                    Select Duration
                  </option>
                  {durationList?.length > 0 &&
                    durationList.map(val => (
                      <option value={val.value} key={val._id}>
                        {val.label}
                      </option>
                    ))}
                </select>
                <Error field="duration" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  ROI Duration<span className="red">*</span>
                </label>
                <select
                  className="detail-input-select custom-select"
                  value={values?.roi_duration}
                  name="roi_duration"
                  onChange={isView || isEdit ? () => {} : handleChange}
                  onBlur={handleBlur}
                  disabled={
                    isView
                      ? true
                      : isEdit
                      ? true
                      : values.duration
                      ? false
                      : true
                  }
                >
                  <option hidden disabled value="">
                    Select Roi Duration
                  </option>
                  {roiDuration?.length > 0 &&
                    roiDuration.map(val => (
                      <option value={val.value} key={val._id}>
                        {val.label}
                      </option>
                    ))}
                </select>
                <Error field="roi_duration" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  ROI in(%)<span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="roi"
                  onChange={isView || isEdit ? () => {} : handleChange}
                  value={values.roi}
                  onBlur={handleBlur}
                  placeholder="ROI in (%)"
                  disabled={isView ? true : isEdit ? true : false}
                />
                <Error field="roi" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Principal withdrawal
                  <span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="principal_withdrawal"
                  onChange={isView || isEdit ? () => {} : handleChange}
                  value={values.principal_withdrawal}
                  onBlur={handleBlur}
                  placeholder="Principal Withdrawal in (%)"
                  disabled={isView ? true : isEdit ? true : false}
                />
                <Error field="principal_withdrawal" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Minimum Value</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="minimum_value"
                  onChange={handleChange}
                  value={values.minimum_value}
                  onBlur={handleBlur}
                  placeholder="Minimum Value"
                  disabled={isView ? true : false}
                />
                <Error field="minimum_value" />
              </div>
            </div>
            <div className="col-12 mt-3 font-weight-bold">
              <label>Business Associate</label>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Commision Method
                  <span className="red">*</span>
                </label>
                {/* <select
                  className="detail-input-select custom-select"
                  value={values?.commision_method}
                  name="commision_method"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isView ? true : false}
                >
                  <option hidden disabled value="">
                    Select commision method
                  </option>
                  <option value={"one time"}>One time</option>
                </select> */}
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="commision_method"
                  onChange={handleChange}
                  value={values.commision_method}
                  onBlur={handleBlur}
                  placeholder="Commision Method"
                  disabled={true}
                />
                <Error field="commision_method" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Commision<span className="red">*</span>
                </label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="commision"
                  onChange={isView || isEdit ? () => {} : handleChange}
                  value={values.commision}
                  onBlur={handleBlur}
                  placeholder="Commision in (%)"
                  disabled={isView ? true : isEdit ? true : false}
                />
                <Error field="commision" />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>Maximum Value</label>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="maximum_value"
                  onChange={handleChange}
                  value={values.maximum_value}
                  onBlur={handleBlur}
                  placeholder="Maximum Value"
                  disabled={isView ? true : false}
                />
                <Error field="maximum_value" />
                {/* <select
                  className="detail-input-select custom-select"
                  value={values?.quantity}
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isView ? true : false}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select> */}
                {/* <Error field="quantity" /> */}
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label>
                  Status <span className="red">*</span>
                </label>
                <select
                  className="detail-input-select custom-select"
                  value={values?.status}
                  name="status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isView ? true : false}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
                <Error field="status" />
              </div>
            </div>
            <div className="col-12">
              <div className="form-group">
                <label>Description</label>
                <div className="quill-editor-container">
                  <ReactQuill
                    name="description"
                    id="description"
                    value={values.description}
                    theme={"snow"}
                    className={isView ? "ql-editor-background" : ""}
                    placeholder={"Description"}
                    modules={SubscriptionAddEdit.modules}
                    formats={SubscriptionAddEdit.formats}
                    bounds={".app"}
                    readOnly={isView}
                    onChange={(content, delta, source, editor) => {
                      // console.log(editor.getLength(), "check417", content);
                      if (editor.getLength() <= 1) {
                        // setValues({ ...values, description  : ""})
                        setFieldValue("description", "");
                      } else {
                        // setValues({ ...values, description: content})
                        setFieldValue("description", content);
                      }
                    }}
                  />
                </div>
                <Error field="description" />
              </div>
            </div>
            {/* <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows={4}
                            className="form-control react-form-input"
                            id="descreption"
                            onChange={handleChange}
                            value={values.descreption}
                            onBlur={handleBlur}
                            placeholder="Description">
                        </textarea>
                        <Error field="descreption" />
                    </div> */}
            {isView ? (
              <></>
            ) : (
              <div className="col-12">
                <div className="row justify-content-end">
                  <div className="col-auto pr-0">
                    <button
                      onClick={e => ServiceHandler(e)}
                      type="submit"
                      className="btn btn-blue"
                      disabled={isValid ? false : true}
                    >
                      {isEdit ? "Update" : "Add"}
                      {/* {console.log(isValid,values,"isValid")} */}
                    </button>
                  </div>
                  <div className="col-auto">
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
            )}
          </div>
        </form>
      </ModalBody>
      {loading ? <Loader /> : ""}
    </>
  );
};

SubscriptionAddEdit.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "link"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ]
  ],
  clipboard: {
    matchVisual: false
  }
};

SubscriptionAddEdit.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link"
];

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default compose(
  // withRouter,
  enhancer,
  connect(mapStateToProps, { success, error })
)(SubscriptionAddEdit);
