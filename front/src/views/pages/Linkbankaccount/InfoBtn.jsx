import React, { useState } from "react";
import infoImage from "../../../assets/images/info-icon.svg";
const NameMatchingTooltip = props => {
  const { message } = props;
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="tooltip-container">
      <img
        src={infoImage}
        className="info-icon"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title={showTooltip ? message : ""}
        alt=""
      />
    </div>
  );
};

export default NameMatchingTooltip;
