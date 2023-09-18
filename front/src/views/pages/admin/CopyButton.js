import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyButton = ({ referralCode, style, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  return (
    <>
      {<span className="mr-2 d-inline-block">{text ? text : ""}</span>}
      <span
        // type="text"
        className={
          text === "Referral Link :" ? "referralinputlink" : "referralinput"
        }
        // value={referralCode}
        // readOnly
        id="referralinput"
        style={style}
      >
        {referralCode}
      </span>
      <span>
        <CopyToClipboard text={referralCode} onCopy={handleCopy}>
          {copied ? (
            <i className="fas fa-copy ml-2"></i>
          ) : (
            <i className="far fa-copy ml-2"></i>
          )}
        </CopyToClipboard>
        {/* <span onClick={handleCopy} className="pointer" aria-label="copy"> */}
        {copied ? (
          <span style={{ color: "green" }} className="ml-2">
            Copied!
          </span>
        ) : (
          <></>
        )}
      </span>
      {/* </span> */}
    </>
  );
};

export default CopyButton;
