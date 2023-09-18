import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import UserPersonalInfo from "./UserPersonalInfo";
import UserAddressInfo from "./UserAddressInfo";
import UserDocumentInfo from "./UserDocumentInfo";
import UserSelfi from "./UserSelfi";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { getKycByUserId } from "services/kycServices";
import Loader from "components/Loader";
import success_img from "../../../assets/images/success.svg";
import approve_img from "../../../assets/images/Group 571.svg";

const { success, error, fetching } = NavigationActions;

const steps = [
  "Personal Info",
  "Address Info",
  "Documents Info",
  "Selfie Photo"
];

function HorizontalLinearStepper(props) {
  const { token, user, kycStatus } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const [kycdetails, setKycdetails] = React.useState({});
  const [comment, setComment] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  //   const isStepOptional = (step) => {
  //     return step === 1;
  //   };

  //   const isStepSkipped = (step) => {
  //     return skipped.has(step);
  //   };

  const getUserKycDatea = async () => {
    setLoading(true);
    await getKycByUserId(token, user?._id).then(res => {
      if (res.success) {
        if (res.data) {
          // console.log(res.data, "check50");
          setKycdetails(res.data);
          if (res.data?.status === "Reject") {
            setComment(res.data?.comment ? res.data?.comment : "");
            setActiveStep(() => Math.min(...res.data?.rejected_section) - 1);
          } else {
            setActiveStep(res.data ? res.data?.step : 0);
          }
        }
        setLoading(false);
      } else {
        error(res.message);
        setLoading(false);
      }
    });
  };
  React.useEffect(() => {
    getUserKycDatea();
  }, []);

  // const handleNext = () => {
  //   let newSkipped = skipped;
  //   // if (isStepSkipped(activeStep)) {
  //   //   newSkipped = new Set(newSkipped.values());
  //   //   newSkipped.delete(activeStep);
  //   // }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped(newSkipped);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  //   const handleSkip = () => {
  //     if (!isStepOptional(activeStep)) {
  //       // You probably want to guard against something like this,
  //       // it should never occur unless someone's actively trying to break something.
  //       throw new Error("You can't skip a step that isn't optional.");
  //     }

  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     setSkipped((prevSkipped) => {
  //       const newSkipped = new Set(prevSkipped.values());
  //       newSkipped.add(activeStep);
  //       return newSkipped;
  //     });
  //   };

  //   const handleReset = () => {
  //     setActiveStep(0);
  //   };
  return (
    <div className="kycapproveheight">
      {!kycStatus ? (
        <>
          <div
            className={comment === "" ? "d-none" : "card p-4 mb-4 commenterror"}
          >
            <p>{comment}</p>
          </div>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} className="custom-stepper">
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                //   if (isStepOptional(index)) {
                //     labelProps.optional = (
                //       <Typography variant="caption">Optional</Typography>
                //     );
                //   }
                //   if (isStepSkipped(index)) {
                //     stepProps.completed = false;
                //   }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-8 col-lg-4">
                      <div className="card kycsuccess">
                        <img src={success_img} alt="success_img" />
                        <p className="text-center">
                          Your Kyc is submitted and it takes 24-48 hrs to
                          approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </Typography>
                {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* {console.log(kycdetails, "check123")} */}
                <Typography sx={{ mt: 2, mb: 1 }}>
                  {/* Step {activeStep + 1} */}
                  {activeStep + 1 === 1 ? (
                    <UserPersonalInfo
                      setActiveStep={e => setActiveStep(e)}
                      setKycdetails={e => setKycdetails(e)}
                      activeStep={activeStep}
                      kycdetails={kycdetails}
                    />
                  ) : activeStep + 1 === 2 ? (
                    <UserAddressInfo
                      setActiveStep={e => setActiveStep(e)}
                      setKycdetails={e => setKycdetails(e)}
                      activeStep={activeStep}
                      kycdetails={kycdetails}
                    />
                  ) : activeStep + 1 === 3 ? (
                    <UserDocumentInfo
                      setActiveStep={e => setActiveStep(e)}
                      setKycdetails={e => setKycdetails(e)}
                      activeStep={activeStep}
                      kycdetails={kycdetails}
                    />
                  ) : (
                    <UserSelfi
                      setActiveStep={e => setActiveStep(e)}
                      setKycdetails={e => setKycdetails(e)}
                      setComment={e => setComment(e)}
                      activeStep={activeStep}
                      kycdetails={kycdetails}
                    />
                  )}
                </Typography>
                {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}> */}
                {/* <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button> */}
                {/* <Box sx={{ flex: "1 1 auto" }} /> */}
                {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}

                {/* <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button> */}
                {/* </Box> */}
              </React.Fragment>
            )}
          </Box>
        </>
      ) : (
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-4">
            <div className="card kycsuccess">
              <img src={approve_img} alt="approve_img" />
              <p className="text-center">Your kyc is approved.</p>
            </div>
          </div>
        </div>
      )}
      {loading ? <Loader /> : <></>}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    kycStatus: state.navigation.kycStatus
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching })
)(HorizontalLinearStepper);
