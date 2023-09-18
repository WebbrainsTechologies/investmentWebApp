import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { getallCurrency } from "services/currencyServices";
import { getSponsorData, getTeamData } from "services/myteamServices";
import usericon from "../../../assets/images/user-icon.svg";
import { ArrowLeft } from "react-feather";
import moment from "moment";
import Loader from "components/Loader";

const { success, error, fetching } = NavigationActions;

const Myteam = props => {
  const { token, user } = props;
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [loading, setLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState("");
  const [sponsorhide, setSponsorHide] = useState(false);
  const [sponsorData, setSponsorData] = useState({});
  const [showteamData, setShowTeamData] = useState(false);
  const [teamDetails, setTeamDetails] = useState({
    firstlineCount: 0,
    firslineInvestment: 0,
    totalTeamCount: 0,
    totalTeamInvestment: 0
  });
  const [teamData, setTeamData] = useState([]);
  const [currencyName, setCurrencyName] = useState("");
  // console.log(teamData, "check29");
  const getCurrencyList = async () => {
    await getallCurrency(token).then(res => {
      // console.log(res.data, "check59");
      if (res.success) {
        if (res.data?.length > 0) {
          setCurrencyData(
            res.data?.map(val => {
              // console.log(val, "checkvale");
              return {
                label: val.name,
                value: val._id
              };
            })
          );
          setSelectedCurrency(res.data[0]?._id);
          setCurrencyName(res.data[0]?.name);
        }
      } else {
        error(res.message);
      }
    });
  };
  useEffect(() => {
    getCurrencyList();
  }, []);
  const getTeamDetails = async () => {
    await getTeamData(token, selectedCurrency).then(res => {
      if (res.success) {
        setTeamData(res.data);
      } else {
        error(res.message);
      }
    });
  };

  useEffect(() => {
    selectedCurrency && getTeamDetails();
  }, [selectedCurrency]);

  const getSponserDetails = async () => {
    setLoading(true);
    await getSponsorData(token, selectedCurrency).then(res => {
      if (res.success) {
        if (res.data?.sponsorData === true) {
          setSponsorHide(true);
        }
        setTeamDetails({
          firstlineCount: res.data?.firstlineCount,
          firslineInvestment: res.data?.firslineInvestment,
          totalTeamCount: res.data?.totalTeamCount,
          totalTeamInvestment: res.data?.totalTeamInvestment
        });
        setSponsorData(res.data?.sponsorData);
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    selectedCurrency && getSponserDetails();
  }, [selectedCurrency]);
  return (
    <div>
      <div className="row justify-content-between align-item-center">
        <div className="col-auto">
          {currencyData && currencyData.length > 0 && (
            <div className="form-group mb-2">
              <select
                className="detail-input-select custom-select border-0"
                value={selectedCurrency}
                name="subscription"
                onChange={e => {
                  // console.log(e.target.value, "check248");
                  setSelectedCurrency(e.target.value);
                }}
              >
                <option hidden disabled value="">
                  Select Currency
                </option>
                {currencyData.length > 0 &&
                  currencyData.map(val => {
                    return (
                      <option value={val.value} key={val.label}>
                        {val.label}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
        </div>
        {showteamData ? (
          <div className="col-auto">
            <button
              className="btn"
              onClick={() => {
                setShowTeamData(false);
              }}
            >
              <ArrowLeft /> Back
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      {showteamData ? (
        <>
          <div className="white-card">
            {/* <div className="d-flex sponsorbox flex-wrap"> */}
            {teamData?.length > 0 &&
              teamData.map(val => {
                return (
                  <div className="teamboxborder">
                    <div className="row">
                      <div className="col-md">
                        <div className="d-flex sponsorbox flex-wrap">
                          <img
                            src={
                              val?.profile_img
                                ? `${process.env.REACT_APP_UPLOAD_DIR}${val?.profile_img}`
                                : usericon
                            }
                            className="sponsorpic"
                            alt="sponsorprofilepicture"
                          />
                          <p className="sponsor-name">
                            <label>Name</label> {val?.name}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-auto text-right">
                        Date of creation:{" "}
                        {moment(val.createdAt).format("DD/MM/YYYY")}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xxl col-md-4">
                        <div className="teamsinglebox">
                          {/* <ArrowLeft className="icon" /> */}
                          <span className="icon">
                            <i class="fas fa-wallet"></i>
                          </span>
                          <p className="team-price">
                            {val.userowninvestment} {currencyName}
                          </p>
                          <p className="team-text">OWN TURNOVER</p>
                        </div>
                      </div>
                      <div className="col-xxl col-md-4">
                        <div className="teamsinglebox">
                          <span className="icon">
                            <i class="fas fa-user-friends"></i>
                          </span>
                          <p className="team-price">{val.firstlineCount}</p>
                          <p className="team-text">1ST LINE PARTNERS</p>
                        </div>
                      </div>
                      <div className="col-xxl col-md-4">
                        <div className="teamsinglebox">
                          <span className="icon">
                            <i class="fas fa-coins"></i>
                          </span>
                          <p className="team-price">
                            {val.firstlineinvestment} {currencyName}
                          </p>
                          <p className="team-text">1ST LINE TURNOVER</p>
                        </div>
                      </div>
                      <div className="col-xxl col-md-4">
                        <div className="teamsinglebox">
                          <span className="icon">
                            <i class="fas fa-users"></i>
                          </span>
                          <p className="team-price">{val.totalteamcount}</p>
                          <p className="team-text">TEAM</p>
                        </div>
                      </div>
                      <div className="col-xxl col-md-4">
                        <div className="teamsinglebox">
                          <span className="icon">
                            <i class="fas fa-coins"></i>
                          </span>
                          <p className="team-price">
                            {val.totalInvestment} {currencyName}
                          </p>
                          <p className="team-text">TEAM TURNOVER</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {/* </div> */}
          </div>
        </>
      ) : (
        <div className="white-card">
          <div className="row">
            {sponsorhide ? (
              <></>
            ) : (
              <div className="col-md-6">
                <div className="d-flex sponsorbox">
                  <img
                    src={
                      sponsorData?.profile_img
                        ? `${process.env.REACT_APP_UPLOAD_DIR}${sponsorData?.profile_img}`
                        : usericon
                    }
                    className="sponsorpic"
                    alt="sponsorprofilepicture"
                  />
                  <p className="sponsor-name">
                    <label>Sponsor</label> {sponsorData?.name}
                  </p>
                </div>
              </div>
            )}
            <div
              className={
                teamData !== true ? "col-md-6 cursor-pointer" : "col-md-6"
              }
              onClick={() => {
                if (teamData !== true) {
                  setShowTeamData(true);
                }
              }}
            >
              <div className="d-flex sponsorbox flex-wrap">
                <img
                  src={
                    user?.profile_img
                      ? `${process.env.REACT_APP_UPLOAD_DIR}${user?.profile_img}`
                      : usericon
                  }
                  className="sponsorpic"
                  alt="sponsorprofilepicture"
                />
                <p className="sponsor-name">
                  <label>User</label> {user?.name}
                </p>
                <div className="col-12 px-0 userlinedata">
                  <p className="d-flex justify-content-between">
                    <label>First Line:</label>{" "}
                    <span className="">{teamDetails.firstlineCount}</span>
                  </p>
                  <p className="d-flex justify-content-between">
                    <label>First Line Investment:</label>{" "}
                    <span className="">{teamDetails.firslineInvestment}</span>
                  </p>
                  <p className="d-flex justify-content-between">
                    <label>All Team:</label>{" "}
                    <span className="">{teamDetails.totalTeamCount}</span>
                  </p>
                  <p className="d-flex justify-content-between">
                    <label>All Team Investment:</label>{" "}
                    <span className="">{teamDetails.totalTeamInvestment}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading ? <Loader /> : <></>}
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
  connect(mapStateToProps, { success, error, fetching })
)(Myteam);
