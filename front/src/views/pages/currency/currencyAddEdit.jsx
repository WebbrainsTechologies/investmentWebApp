import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalHeader } from "reactstrap";
import { compose } from "redux";
import enhancer from "./enhancer/currencyAddEditEnhancer";
import NavigationActions from "redux/navigation/actions";
import Loader from "components/Loader";
import { addCurrency, editCurrency } from "services/currencyServices";
import detail_img from "../../../assets/images/Frame 463426.svg";
import { featchToken } from "services/onemetaapis";
import axios from "axios";

const { success, error } = NavigationActions;
const CurrencyAddEdit = props => {
  const inputFile = useRef(null);
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
  const [inputName, setInputName] = useState("");
  const [getCurrencyDetails, setCurrencyDetails] = useState([]);

  useEffect(() => {
    isEdit &&
      setValues({
        ...editData,
        onmeta_data: JSON.stringify({
          address: editData.address,
          chainId: editData.chainId,
          decimals: editData.decimals,
          symbol: editData.symbol,
          onmeta_name: editData.name
        })
      });
  }, [editData]);

  const getOneMetaCurrency = async () => {
    await axios
      .get("https://api.onmeta.in/v1/tokens/", {
        headers: {
          "x-api-key": "de2f4c96-0fca-4117-995c-62dc33eeb716"
        }
      })
      .then(res => {
        setCurrencyDetails(
          () =>
            res?.data?.length > 0 &&
            res.data?.map(val => {
              // console.log(val, "check60");
              return {
                value: JSON.stringify({
                  ...val,
                  onmeta_name: val.name
                }),
                label: `${val.symbol} (${val.name})`
              };
            })
        );
      });
  };
  useEffect(() => {
    getOneMetaCurrency();
  }, []);

  const ServiceHandler = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      // let formData = new FormData();
      // formData.append("name", values.name);
      // // formData.append("multiply_value", values.multiply_value);
      // formData.append(
      //   "currency_logo",
      //   values.current_file === null
      //     ? values.currency_logo
      //     : values.current_file
      // );
      let data = {
        name: values.name,
        onmeta_data: values.onmeta_data
      };
      setLoading(true);
      isEdit
        ? await editCurrency(token, values._id, data).then(res => {
            if (res.success) {
              success(res.message);
              setLoading(false);
              toggleRefresh(true);
              onClose();
            } else {
              error(res.message);
              setLoading(false);
            }
          })
        : await addCurrency(token, data).then(res => {
            if (res.success) {
              success(res.message);
              setLoading(false);
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
  // console.log(errors, "check87");
  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {isEdit ? "Edit" : "Add"} Currency
      </ModalHeader>
      <ModalBody>
        <form>
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
              placeholder="Currency Name"
            />
            <Error field="name" />
          </div>
          <div className="form-group">
            <label>
              Currency <span className="red">*</span>
            </label>
            <select
              className="detail-input-select custom-select"
              value={values?.onmeta_data}
              name="onmeta_data"
              onChange={handleChange}
              onBlur={handleBlur}
              // disabled={isView ? true : isEdit ? true : false}
            >
              {/* {console.log(getCurrencyDetails, "check151")} */}
              <option hidden disabled value="">
                Select currency
              </option>
              {getCurrencyDetails?.length > 0 &&
                getCurrencyDetails.map(val => (
                  <option value={val.value} key={val._id}>
                    {val.label}
                  </option>
                ))}
            </select>
            <Error field="onmeta_data" />
          </div>
          {/* <div className="form-group">
            <label>
              Value <span className="red">*</span>
            </label>
            <input
              type="number"
              className="form-control react-form-input"
              id="multiply_value"
              onChange={handleChange}
              value={values.multiply_value}
              onBlur={handleBlur}
              placeholder="Currency Value"
            />
            <Error field="multiply_value" />
          </div> */}
          {/* <div className="form-group">
            <label>
              Logo <span className="red">*</span>
            </label>
            <input
              type="file"
              hidden
              name="currency_logo"
              ref={inputFile}
              className="form-control react-form-input"
              id="currency_logo"
              accept=".jpg,.png,.jpeg,.svg"
              onChange={(e) => {
                console.log(inputFile.current.value, "137");
                if (
                  ["png", "jpg", "jpeg", "svg+xml"].includes(
                    e.target.files[0]?.type.split("/")[1]
                  )
                ) {
                  setValues({
                    ...values,
                    current_file: e.target.files[0],
                    currency_logo: URL.createObjectURL(e.target.files[0]),
                  });
                  setInputName(inputFile.current.value?.split("\\").pop());
                } else {
                  error(
                    "This file format is not accepted. You can upload only SVG, JPEG, JPG, and PNG Files"
                  );
                }
              }}
              onBlur={handleBlur}
            />
            <div className="file-group">
              <label
                className="detail-img-wrap mb-0 cursor"
                htmlFor="currency_logo"
                style={{ borderRadius: "50%" }}
              >
                {values.currency_logo === "" && (
                  <>
                    <img
                      src={detail_img}
                      className="detail-img userprofileimage"
                      alt="default"
                    />
                    <span className="file-placeholder">add currency logo</span>
                  </>
                )}
                {values.currency_logo !== "" && (
                  <>
                    <img
                      src={
                        values.current_file === null
                          ? `${process.env.REACT_APP_UPLOAD_DIR}${values.currency_logo}`
                          : values.currency_logo
                      }
                      className="profile-img patient_img"
                      alt="no"
                    />
                    <span>{inputName}</span>
                  </>
                )}
              </label>
            </div>
            {console.log("called")}
            <Error field="currency_logo" />
          </div> */}
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
)(CurrencyAddEdit);
