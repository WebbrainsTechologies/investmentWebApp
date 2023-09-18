import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/durationAddEditEnhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import { addDuration, editDuration } from "services/durationServices";

const { success, error } = NavigationActions;
const DurationAddEdit = props => {
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
    handleSubmit,
    toggleRefresh
  } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isEdit && setValues({ ...editData });
  }, [editData]);

  const ServiceHandler = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      let data = {
        month: values.month,
        status: values.status
      };
      setLoading(true);
      isEdit
        ? await editDuration(token, values._id, data).then(res => {
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
        : await addDuration(token, data).then(res => {
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
        {isEdit ? "Edit" : "Add"} Duration
      </ModalHeader>
      <ModalBody>
        <form>
          <div className="form-group">
            <label>
              Months <span className="red">*</span>
            </label>
            <input
              type="text"
              className="form-control react-form-input"
              id="month"
              onChange={handleChange}
              value={values.month}
              onBlur={handleBlur}
              placeholder="Duration in months"
            />
            <Error field="month" />
          </div>
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
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <Error field="status" />
          </div>
          <div className="row justify-content-end">
            <div className="col-auto pr-0">
              <button
                onClick={e => ServiceHandler(e)}
                type="submit"
                className="btn btn-blue"
              >
                {isEdit ? "Update" : "Add"}
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
        </form>
      </ModalBody>
      {loading ? <Loader /> : ""}
    </>
  );
};

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
)(DurationAddEdit);
