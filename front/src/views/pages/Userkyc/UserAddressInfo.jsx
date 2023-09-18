import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import enhancer from "./enhancer/UseraddressinfoEnhancer";
import NavigationActions from "redux/navigation/actions";
import { editKyc } from "services/kycServices";
import { Country, City, State } from "country-state-city";
import Select from "react-select";

const { success, error, fetching } = NavigationActions;

const UserAddressInfo = props => {
  const {
    setActiveStep,
    activeStep,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    submitCount,
    setValues,
    kycdetails,
    handleSubmit,
    token,
    setKycdetails,
    isValid
  } = props;

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedcity, setSelectedCity] = useState("");

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
  const [btnDisable, setBtnDisable] = useState(false);

  // console.log(kycdetails, "check35");

  useEffect(() => {
    kycdetails &&
      setValues({
        ...values,
        address_line_one: kycdetails?.address_line_one,
        address_line_second: kycdetails?.address_line_second,
        address_line_third: kycdetails?.address_line_third,
        country: kycdetails?.country,
        state: kycdetails?.state,
        city: kycdetails?.city,
        pincode: kycdetails?.pincode
      });
    setSelectedCountry(kycdetails?.country_iso_code);
    setSelectedState(kycdetails?.state_iso_code);
  }, []);

  useEffect(() => {
    // console.log(Country.getAllCountries(), "checkcountry");

    setCountryData(
      Country.getAllCountries()?.map(val => {
        return { value: val.isoCode, label: val.name };
      })
    );
    // console.log(State.getStatesOfCountry("AU"), "checkstate");
  }, []);
  useEffect(() => {
    selectedCountry &&
      setStateData(
        State.getStatesOfCountry(selectedCountry)?.map(val => {
          return { value: val.isoCode, label: val.name };
        })
      );
  }, [selectedCountry]);

  // console.log(stateData, "check86", selectedCountry);

  useEffect(() => {
    selectedState &&
      setCityData(
        City.getCitiesOfState(selectedCountry, selectedState)?.map(val => {
          return { value: val.name, label: val.name };
        })
      );
  }, [selectedCountry, selectedState]);

  // console.log(City.getCitiesOfState("AR"), "check98");

  const handleEditKyc = async () => {
    handleSubmit();
    if (isValid) {
      await editKyc(token, kycdetails?._id, {
        ...values,
        country_iso_code: selectedCountry,
        state_iso_code: selectedState
      }).then(res => {
        // console.log(res, "check58");
        if (res.success) {
          setKycdetails(res.data?._doc);
          setActiveStep(activeStep + 1);
          setBtnDisable(false);
        } else {
          error(res.message);
          setBtnDisable(false);
        }
      });
    } else {
      setBtnDisable(false);
    }
  };
  return (
    <div className="card p-4">
      <div className="row">
        <div className="col-12">
          <div className="form-group">
            <label>
              Address Line 1 <small>(As per the documents)</small>
            </label>{" "}
            <span className="red">*</span>
            <input
              type="text"
              className="form-control react-form-input"
              id="address_line_one"
              onChange={handleChange}
              value={values?.address_line_one}
              onBlur={handleBlur}
              placeholder={"Address Line 1"}
            />
            <Error field="address_line_one" />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="address_line_second"
              onChange={handleChange}
              value={values?.address_line_second}
              onBlur={handleBlur}
              placeholder={"Address Line 2"}
            />
            <Error field="address_line_second" />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Address Line 3</label>
            <input
              type="text"
              className="form-control react-form-input"
              id="address_line_third"
              onChange={handleChange}
              value={values?.address_line_third}
              onBlur={handleBlur}
              placeholder={"Address Line 3"}
            />
            <Error field="address_line_third" />
          </div>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-6">
              {/* <div className="form-group">
                <label>City</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="city"
                  onChange={handleChange}
                  value={values?.city}
                  onBlur={handleBlur}
                  placeholder={"City Name"}
                />
                <Error field="city" />
              </div> */}
              {/* {console.log(countryData, "check177")} */}
              <div className="form-group">
                <label>Country</label> <span className="red">*</span>
                <Select
                  id="country"
                  name="country"
                  options={countryData}
                  classNamePrefix="select"
                  placeholder="select country"
                  value={countryData.find(val => {
                    return val.label === values.country;
                  })}
                  onChange={e => {
                    if (e) {
                      setValues({
                        ...values,
                        country: e.label,
                        state: "",
                        city: ""
                      });
                      setSelectedCountry(e.value);
                    }
                  }}
                />
                <Error field="country" />
              </div>
            </div>
            {/* {console.log(values, "checkvalues219")} */}
            <div className="col-md-6">
              {/* <div className="form-group">
                <label>State</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="state"
                  onChange={handleChange}
                  value={values?.state}
                  onBlur={handleBlur}
                  placeholder={"State Name"}
                />
                <Error field="state" />
              </div> */}
              <div className="form-group">
                <label>State</label> <span className="red">*</span>
                <Select
                  id="state"
                  name="state"
                  options={stateData}
                  classNamePrefix="select"
                  placeholder="select state"
                  isDisabled={values.country ? false : true}
                  value={stateData?.find(val => {
                    return val.label === values.state;
                  })}
                  onChange={e => {
                    if (e) {
                      setValues({
                        ...values,
                        state: e.label,
                        city: ""
                      });
                      setSelectedState(e.value);
                    }
                  }}
                />
                <Error field="state" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>City</label> <span className="red">*</span>
                <Select
                  id="city"
                  name="city"
                  options={cityData}
                  classNamePrefix="select"
                  placeholder="select city"
                  isDisabled={values.country && values.state ? false : true}
                  value={cityData?.find(val => {
                    return val.label === values.city;
                  })}
                  onChange={e => {
                    if (e) {
                      setValues({
                        ...values,
                        city: e.label
                      });
                      setSelectedCity(e.value);
                    }
                  }}
                />
                <Error field="city" />
              </div>
              {/* <div className="form-group">
                <label>Country</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="country"
                  onChange={handleChange}
                  value={values?.country}
                  onBlur={handleBlur}
                  placeholder={"Country Name"}
                />
                <Error field="country" />
              </div> */}
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Pincode</label> <span className="red">*</span>
                <input
                  type="text"
                  className="form-control react-form-input"
                  id="pincode"
                  onChange={handleChange}
                  value={values?.pincode}
                  onBlur={handleBlur}
                  placeholder={"Enter Pincode"}
                />
                <Error field="pincode" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 text-right">
          <button
            className="btn modalcancelbutton mr-3"
            onClick={() => {
              setActiveStep(activeStep - 1);
            }}
          >
            Back
          </button>
          <button
            className="btn btn-blue"
            disabled={btnDisable}
            onClick={() => {
              setBtnDisable(true);
              handleEditKyc();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching })
)(UserAddressInfo);
