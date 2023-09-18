import React, { useState } from "react";
import { connect } from "react-redux";
import { loginBack } from "helper/constant";

const UserProfile = () => {
  const [feed, setFeed] = useState(true);
  const [media, setMedia] = useState(false);
  const [info, setInfo] = useState(false);

  const activePanel = data => {
    setFeed(false);
    setMedia(false);
    setInfo(false);
    if (data === "feed") {
      setFeed(true);
    } else if (data === "media") {
      setMedia(true);
    } else if (data === "info") {
      setInfo(true);
    }
  };

  const Back = {
    backgroundImage: `url(${loginBack})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  };

  const titleStyle = {
    background: "#563c91",
    color: "white",
    fontWeight: 600
  };
  const activeColor = {
    color: "#563c91"
  };

  const profileTabLink = {
    borderBottom: `2px solid`,
    borderColor: "#563c91"
  };

  return (
    <div className="Profile-component">
      <div className="container-fluid">
        <div className="row">
          {/* <div className="col-md-12 col-lg-4 col-xl-3 profile-left-shade">
            <ProfileInfoComponent activeColor={activeColor} />
          </div> */}

          <div className="col-md-12 col-lg-12 col-xl-12 profile-right-shade mt-4">
            <div className="profile-header-panel pa-10 mt-4">
              <div className="headline">Profile</div>
            </div>
          </div>

          <div className="col-12">
            <button className="c-btn c-danger c-btn-round c-btn-lg send-req-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger
  };
};

export default connect(mapStateToProps, null)(UserProfile);
